import { Req } from 'src/domain/Req';
import { FilterDto, ReqDto } from '../dto/Req.dto';

export class ReqPresenter {
  dtoToEntity(reqDto: ReqDto): Req {
    const subscription_id = reqDto[1];
    const filters: FilterDto[] = reqDto.slice(2) as FilterDto[];
    const req = new Req({
      subscription_id,
      filters: filters.map((filter) => {
        return {
          ids: filter.ids,
          authors: filter.authors,
          kinds: filter.kinds,
          e: filter['#e'],
          p: filter['#p'],
          since: filter.since,
          until: filter.until,
          limit: filter.limit,
        };
      }),
    });
    return req;
  }
}
