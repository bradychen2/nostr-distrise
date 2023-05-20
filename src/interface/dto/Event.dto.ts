import { MsgType } from 'src/domain/constant';

export class EventDetail {
  id!: string;
  pubkey!: string;
  created_at!: number;
  kind!: number;
  tags: string[][] = [];
  content!: string;
  sig!: string;
}

export type EventDto = [MsgType.EVENT, EventDetail];
