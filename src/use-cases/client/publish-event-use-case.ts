import { Injectable } from '@nestjs/common';
import { Event } from 'src/domain/Event';
import { IDataServices } from 'src/framework/data-services/abstract/data-services.abstract';

@Injectable()
export class PublishEventUseCase {
  constructor(private dataServices: IDataServices) {}

  private async signEvent(event: Event): Promise<Event> {
    await event.sign(`${process.env.PRIVATE_KEY}`);
    return event;
  }

  public async publishEvent(): Promise<Event> {
    try {
      const event = new Event({
        pubkey: `${process.env.PUBLIC_KEY}`,
        created_at: Math.floor(Date.now() / 1000),
        kind: 1,
        tags: [
          ['p', `${process.env.PUBLIC_KEY}}`, `${process.env.TEST_RELAY_URL}`],
        ],
        content: 'test by brady',
      });
      await this.signEvent(event);
      await this.dataServices.event.create(event);
      return event;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        throw error;
      }
      throw new Error(`Error creating event: ${error}`);
    }
  }
}
