import { Event } from 'server/src/domain/Event';

export class PublishEventUseCase {
  public createEvent() {
    const event = new Event({
      pubkey: `${process.env.PUBLIC_KEY}`,
      created_at: Math.floor(Date.now() / 1000),
      kind: 1,
      tags: [
        ['p', `${process.env.PUBLIC_KEY}}`, `${process.env.TEST_RELAY_URL}`],
      ],
      content: 'test by brady',
    });
    return event;
  }

  public async signEvent(event: Event) {
    await event.sign(`${process.env.PRIVATE_KEY}`);
    return event;
  }
}
