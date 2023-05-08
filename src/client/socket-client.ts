import { Injectable, OnModuleInit } from '@nestjs/common';
import { WebSocket } from 'ws';
import { PublishEventUseCase } from 'src/use-cases/client/publish-event-use-case';

@Injectable()
export class SocketClient implements OnModuleInit {
  public socketClient: WebSocket;

  constructor(private readonly publishEventUseCase: PublishEventUseCase) {
    this.socketClient = new WebSocket(`${process.env.TEST_RELAY_URL}`);
  }

  async onModuleInit() {
    await this.triggerClientEvent();
  }

  private async triggerClientEvent() {
    this.socketClient.on('open', async () => {
      console.log(`Connected to ${process.env.TEST_RELAY_URL}!!!`);
      await this.publishEvent();
    });
  }

  private async publishEvent() {
    const event = this.publishEventUseCase.createEvent();
    await this.publishEventUseCase.signEvent(event);
    this.socketClient.send(JSON.stringify(['EVENT', event]));
  }
}
