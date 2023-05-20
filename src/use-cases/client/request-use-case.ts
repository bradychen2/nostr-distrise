import { IDataServices } from 'src/framework/data-services/abstract/data-services.abstract';
import { Event } from 'src/domain/Event';
import { Injectable } from '@nestjs/common';
@Injectable()
export class ReqUseCase {
  constructor(private readonly dataServices: IDataServices) {}

  public async getAllEvents(): Promise<Event[]> {
    const events: Event[] = await this.dataServices.event.getAllInAscOrder(
      'created_at',
    );
    return events;
  }
}
