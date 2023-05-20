import { BadRequestException, PipeTransform } from '@nestjs/common';
import { EventDto } from 'src/interface/dto/Event.dto';
import { ReqDto } from 'src/interface/dto/Req.dto';
import { EventSchema } from 'src/gateway/validator/schema/Event.schema';
import { ReqSchema } from 'src/gateway/validator/schema/Req.schema';
import { CloseDto } from 'src/interface/dto/Close.dto';
import { CloseSchema } from './schema/Close.schema';

export class EventValidatorPipe implements PipeTransform<EventDto> {
  public transform(eventDto: EventDto): EventDto {
    const result = EventSchema.validate(eventDto, {
      abortEarly: false,
    });
    if (result.error) {
      const errorMessages = result.error.details.map((e) => e.message).join();
      throw new BadRequestException(errorMessages);
    }
    return eventDto;
  }
}

export class ReqValidatorPipe implements PipeTransform<ReqDto> {
  public transform(reqDto: ReqDto): ReqDto {
    const result = ReqSchema.validate(reqDto, {
      abortEarly: false,
    });
    if (result.error) {
      const errorMessages = result.error.details.map((e) => e.message).join();
      throw new BadRequestException(errorMessages);
    }
    return reqDto;
  }
}

export class CloseValidatorPipe implements PipeTransform<CloseDto> {
  public transform(closeDto: CloseDto) {
    const result = CloseSchema.validate(closeDto, {
      abortEarly: false,
    });
    if (result.error) {
      const errorMessages = result.error.details.map((e) => e.message).join();
      throw new BadRequestException(errorMessages);
    }
    return closeDto;
  }
}
