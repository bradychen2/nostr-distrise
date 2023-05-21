import { Injectable } from '@nestjs/common';
import { MsgType } from 'src/domain/constant';
@Injectable()
export class NoticeUseCase {
  public createNotice(message: string): [MsgType, string] {
    return [MsgType.NOTICE, message];
  }
}
