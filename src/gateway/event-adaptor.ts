/* eslint-disable @typescript-eslint/ban-types */
import { WebSocketAdapter, INestApplicationContext } from '@nestjs/common';
import * as WebSocket from 'ws';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';
import { NoticeUseCase } from 'src/use-cases/client/notice-use-case';

export class EventAdapter implements WebSocketAdapter {
  constructor(
    private app: INestApplicationContext,
    private noticeUseCase: NoticeUseCase,
  ) {}

  create(port: number, options: any = {}): any {
    return new WebSocket.Server({ port, ...options });
  }

  bindClientConnect(server, callback: Function) {
    server.on('connection', callback);
  }

  bindClientDisconnect(client: any, callback: Function) {
    client.on('close', callback);
  }

  close(server) {
    server.close();
  }

  bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    fromEvent(client, 'message')
      .pipe(
        mergeMap((data) => this.bindMessageHandler(data, handlers, process)),
        filter((result) => result),
      )
      .subscribe((response) => client.send(JSON.stringify(response)));
  }

  public bindMessageHandler(
    message,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ): Observable<any> {
    try {
      const parsedData = JSON.parse(message.data.toString());
      if (!Array.isArray(parsedData)) {
        return transform(
          this.noticeUseCase.createNotice(
            'Invalid message format: must be a JSON array',
          ),
        );
      }
      const [type, ...data] = parsedData;
      const messageHandler = handlers.find(
        (handler) => handler.message === type,
      );
      if (!messageHandler) {
        return transform(
          this.noticeUseCase.createNotice(`Invalid message type: ${type}`),
        );
      }
      return transform(messageHandler.callback(parsedData));
    } catch (error) {
      return transform(
        this.noticeUseCase.createNotice(`error: ${(error as Error).message}`),
      );
    }
  }
}
