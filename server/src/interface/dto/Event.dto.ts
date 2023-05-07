export class EventData {
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
}

export type EventDto = ['EVENT', EventData];
