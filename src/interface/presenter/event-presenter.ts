import { MsgType } from 'src/domain/constant';
import { Event } from '../../domain/Event';
import { EventDto } from '../dto/Event.dto';

export class EventPresenter {
  dtoToEntity(eventDto: EventDto): Event {
    // create new event and send to gateway
    const eventDetail = eventDto[1];
    const event = new Event({
      id: eventDetail.id,
      pubkey: eventDetail.pubkey,
      created_at: eventDetail.created_at,
      kind: eventDetail.kind,
      tags: eventDetail.tags,
      content: eventDetail.content,
      sig: eventDetail.sig,
    });
    return event;
  }

  entityToDto(event: Event): EventDto {
    return [
      MsgType.EVENT,
      {
        id: event.id,
        pubkey: event.pubkey,
        created_at: event.created_at,
        kind: event.kind,
        tags: event.tags,
        content: event.content,
        sig: event.sig,
      },
    ];
  }
}
