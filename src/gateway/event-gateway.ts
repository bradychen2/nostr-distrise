import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer } from 'ws';
import { EventDto } from '../interface/dto/Event.dto';
import { EventPresenter } from '../interface/presenter/event-presenter';
import { Event } from '../domain/Event';
import {
  CloseValidatorPipe,
  EventValidatorPipe,
  ReqValidatorPipe,
} from './validator/validators';
import { ReqDto } from 'src/interface/dto/Req.dto';
import { Req } from 'src/domain/Req';
import { EventUseCase } from 'src/use-cases/client/event-use-case';
import { ReqUseCase } from 'src/use-cases/client/request-use-case';
import { ReqPresenter } from 'src/interface/presenter/request-presenter';
import { MsgType } from 'src/domain/constant';
import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CloseDto } from 'src/interface/dto/Close.dto';
@Injectable()
@WebSocketGateway(3001)
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  wss!: WebSocketServer;
  clients: Map<WebSocket, string> = new Map();
  subscribers: Map<string, WebSocket> = new Map(); // <subscription_id, client>
  constructor(
    private readonly eventPresenter: EventPresenter,
    private readonly reqPresenter: ReqPresenter,
    private readonly eventUseCase: EventUseCase,
    private readonly reqUseCase: ReqUseCase,
  ) {}

  afterInit(server: WebSocketServer) {
    this.wss = server;
    console.log(`Websocket Server Initialized!!!`);
  }

  handleConnection(client: WebSocket) {
    const clientId = uuidv4();
    this.clients.set(client, clientId);
    console.log(`Client connected: ${clientId}`);
  }

  handleDisconnect(client: WebSocket) {
    const clientId = this.clients.get(client);
    this.clients.delete(client);
    console.log(`Client disconnected: ${clientId}`);
  }

  @SubscribeMessage(MsgType.EVENT)
  async event(
    @ConnectedSocket() client: WebSocket,
    @MessageBody(new EventValidatorPipe()) eventDto: EventDto,
  ): Promise<void> {
    try {
      const eventEntity: Event = this.eventPresenter.dtoToEntity(eventDto);
      const clientId = this.clients.get(client);
      if (!(await Event.validateSignature(eventEntity))) {
        throw new BadRequestException(
          `Invalid signature from client-id: ${clientId}`,
        );
      }
      if (!(await Event.validateId(eventEntity))) {
        throw new BadRequestException(`Invalid id from client-id: ${clientId}`);
      }
      // save event to db
      await this.eventUseCase.receiveEvent(eventEntity);
      console.log('received event: ', JSON.stringify(eventEntity));
      // send event to all subscribers
      const eventDetails = eventDto[1];
      for (const [subscription_id, client] of this.subscribers) {
        const serverSideEvent = [MsgType.EVENT, subscription_id, eventDetails];
        await client.send(JSON.stringify(serverSideEvent));
        const clientId = this.clients.get(client);
        console.log(
          `sent new event to subscriber - client-id: ${clientId}, subscription-id: ${subscription_id}`,
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage(MsgType.REQ)
  async req(
    @ConnectedSocket() client: WebSocket,
    @MessageBody(new ReqValidatorPipe()) reqDto: ReqDto,
  ): Promise<void> {
    const reqEntity: Req = this.reqPresenter.dtoToEntity(reqDto);
    console.log('received req: ', JSON.stringify(reqEntity));
    // set client as subscriber
    const { subscription_id } = reqEntity;
    this.subscribers.set(subscription_id, client);
    // send all events to client
    const events: Event[] = await this.reqUseCase.getAllEvents();
    for (const event of events) {
      const eventDto: EventDto = this.eventPresenter.entityToDto(event);
      await client.send(
        JSON.stringify([eventDto[0], subscription_id, eventDto[1]]),
      );
    }
    // send eose to client
    // used to indicate the end of stored events and the beginning of events newly received in real-time
    const eose = this.reqUseCase.createEOSE(subscription_id);
    await client.send(JSON.stringify(eose));
  }

  @SubscribeMessage(MsgType.CLOSE)
  async close(
    @ConnectedSocket() client: WebSocket,
    @MessageBody(new CloseValidatorPipe()) closeDto: CloseDto,
  ): Promise<void> {
    const subscription_id = closeDto[1];
    if (this.subscribers.delete(subscription_id)) {
      const clientId = this.clients.get(client);
      console.log(
        `Client unsubscribed: ${clientId}, subscription-id: ${subscription_id}`,
      );
    } else {
      throw new BadRequestException(
        `Subscription id not exists: ${subscription_id}`,
      );
    }
  }
}
