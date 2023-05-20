import { MsgType } from 'src/domain/constant';

export class FilterDto {
  ids: string[] = []; // <a list of event ids or prefixes>,
  authors: string[] = []; // <a list of pubkeys or prefixes, the pubkey of an event must be one of these>,
  kinds: number[] = []; // <a list of a kind numbers>,
  '#e': string[] = []; // <a list of event ids that are referenced in an e tag>,
  '#p': string[] = []; // <a list of pubkeys that are referenced in a p tag>,
  since!: number; // <an integer unix timestamp, events must be newer than this to pass>,
  until!: number; // <an integer unix timestamp, events must be older than this to pass>,
  limit = 200; // <maximum number of events to be returned in the initial query>
}

export type ReqDto = [MsgType.REQ, string, ...FilterDto[]];
