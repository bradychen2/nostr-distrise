import { IDataServices } from 'src/framework/data-services/abstract/data-services.abstract';
import { Event } from 'src/domain/Event';
import { Injectable } from '@nestjs/common';
import { MsgType } from 'src/domain/constant';
@Injectable()
export class ReqUseCase {
  constructor(private readonly dataServices: IDataServices) {}

  public async getAllEvents(): Promise<Event[]> {
    const events: Event[] = await this.dataServices.event.getAllInAscOrder(
      'created_at',
    );
    return events;
  }

  public createEOSE(subscription_id: string): [MsgType, string] {
    return [MsgType.EOSE, subscription_id];
  }
}
