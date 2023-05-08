import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventDto } from 'src/interface/dto/Event.dto';
import { EventPresenter } from 'src/interface/presenter/event-presenter';

@WebSocketGateway(3001)
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(private readonly eventPresenter: EventPresenter) {}

  afterInit() {
    console.log(`Websocket Server Initialized!!!`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('EVENT')
  async event(@MessageBody() eventDto: EventDto): Promise<void> {
    console.log('received event: ', eventDto);
    await this.wss.emit('EVENT', eventDto);
  }
}
