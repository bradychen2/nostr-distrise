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
  EventValidatorPipe,
  ReqValidatorPipe,
} from './validator/event-validator';
import { ReqDto } from 'src/interface/dto/Req.dto';
import { Req } from 'src/domain/Req';
import { ReqPresenter } from 'src/interface/presenter/request-presenter';
import { ReqUseCase } from 'src/use-cases/client/request-use-case';
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

  @SubscribeMessage('EVENT')
  async event(
    @ConnectedSocket() client: Socket,
    @MessageBody(new EventValidatorPipe()) event: EventDto,
  ): Promise<void> {
    const eventEntity: Event = this.eventPresenter.dtoToEntity(event);
    if (!(await Event.validateSignature(eventEntity))) {
      throw new Error(`Invalid signature from client-id: ${client.id}`);
    }
    console.log('received event: ', JSON.stringify(eventEntity));
    await this.wss.emit('message', event);
  }

  @SubscribeMessage('message')
  async req(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ReqValidatorPipe()) req: ReqDto,
  ): Promise<void> {
    const reqEntity: Req = this.reqPresenter.dtoToEntity(req);
    console.log('received req: ', JSON.stringify(reqEntity));
    // set client as subscriber
    this.subscribers.set(reqEntity.subscription_id, client);
    // send all events to client
    const events: Event[] = await this.reqUseCase.getAllEvents();
    for (const event of events) {
      const eventDto: EventDto = this.eventPresenter.entityToDto(event);
      await this.wss.to(client.id).emit('message', JSON.stringify(eventDto));
    }
  }
}
