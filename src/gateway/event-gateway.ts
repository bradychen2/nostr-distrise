import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  createParamDecorator,
} from '@nestjs/common';
import { CloseDto } from 'src/interface/dto/Close.dto';

export const MessageType = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const handler = context.getHandler();
    return Reflect.getMetadata('messageType', handler);
  },
);

@Injectable()
@WebSocketGateway(3001)
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  wss!: Server;
  clients: Map<string, Socket> = new Map(); // <>client_id, client>
  subscribers: Map<string, Socket> = new Map(); // <subscription_id, client>
  constructor(
    private readonly eventPresenter: EventPresenter,
    private readonly reqPresenter: ReqPresenter,
    private readonly eventUseCase: EventUseCase,
    private readonly reqUseCase: ReqUseCase,
  ) {}

  afterInit() {
    console.log(`Websocket Server Initialized!!!`);
  }

  handleConnection(client: Socket) {
    this.clients.set(client.id, client);
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(MsgType.EVENT)
  async event(
    @ConnectedSocket() client: Socket,
    @MessageBody(new EventValidatorPipe()) eventDto: EventDto,
  ): Promise<void> {
    const eventEntity: Event = this.eventPresenter.dtoToEntity(eventDto);
    if (!(await Event.validateSignature(eventEntity))) {
      throw new BadRequestException(
        `Invalid signature from client-id: ${client.id}`,
      );
    }
    if (!(await Event.validateId(eventEntity))) {
      throw new BadRequestException(`Invalid id from client-id: ${client.id}`);
    }
    // save event to db
    await this.eventUseCase.receiveEvent(eventEntity);
    console.log('received event: ', JSON.stringify(eventEntity));
    // send event to all subscribers
    const eventDetails = eventDto[1];
    for (const [subscription_id, client] of this.subscribers) {
      const serverSideEvent = [MsgType.EVENT, subscription_id, eventDetails];
      await this.wss
        .to(client.id)
        .emit('message', JSON.stringify(serverSideEvent));
      console.log(
        `sent new event to subscriber - client-id: ${client.id}, subscription-id: ${subscription_id}`,
      );
    }
  }

  @SubscribeMessage(MsgType.REQ)
  async req(
    @ConnectedSocket() client: Socket,
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
      await this.wss.to(client.id).emit('message', JSON.stringify(eventDto));
    }
    // send eose to client
    // used to indicate the end of stored events and the beginning of events newly received in real-time
    const eose = this.reqUseCase.createEOSE(subscription_id);
    await this.wss.to(client.id).emit('message', JSON.stringify(eose));
  }

  @SubscribeMessage(MsgType.CLOSE)
  async close(
    @ConnectedSocket() client: Socket,
    @MessageBody(new CloseValidatorPipe()) closeDto: CloseDto,
  ): Promise<void> {
    const subscription_id = closeDto[1];
    if (this.subscribers.delete(subscription_id)) {
      console.log(
        `Client unsubscribed: ${client.id}, subscription-id: ${subscription_id}`,
      );
    } else {
      throw new BadRequestException(
        `Subscription id not exists: ${subscription_id}`,
      );
    }
  }
}
