import { Event } from 'server/src/domain/Event';
import { EventData, EventDto } from '../dto/Event.dto';

export class EventPresenter {
  dtoToEntity(eventDto: EventDto): Event {
    const eventData: EventData = eventDto[1];
    // create new event and send to gateway
    const event = new Event({
      pubkey: eventData.pubkey,
      created_at: eventData.created_at,
      kind: eventData.kind,
      tags: eventData.tags,
      content: eventData.content,
    });
    return event;
  }

  entityToDto(event: Event): EventDto {
    return [
      'EVENT',
      {
        pubkey: event.pubkey,
        created_at: event.created_at,
        kind: event.kind,
        tags: event.tags,
        content: event.content,
      },
    ];
  }
}
