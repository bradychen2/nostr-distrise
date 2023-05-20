class Filter {
  ids: string[];
  authors: string[];
  kinds: number[];
  e: string[];
  p: string[];
  since: number;
  until: number;
  limit: number;

  constructor(filter: { ids; authors; kinds; e; p; since; until; limit }) {
    const { ids, authors, kinds, e, p, since, until, limit } = filter;
    this.ids = ids;
    this.authors = authors;
    this.kinds = kinds;
    this.e = e;
    this.p = p;
    this.since = since;
    this.until = until;
    this.limit = limit;
  }
}

export class Req {
  subscription_id: string;
  filters: Filter[];

  constructor(req: {
    subscription_id;
    filters: { ids; authors; kinds; e; p; since; until; limit }[];
  }) {
    const { subscription_id, filters } = req;
    this.subscription_id = subscription_id;
    this.filters = filters.map((filter) => new Filter(filter));
  }
}
