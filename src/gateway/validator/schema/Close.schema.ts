import * as Joi from 'joi';
import { MsgType } from 'src/domain/constant';

export const CloseSchema = Joi.array().ordered(
  Joi.string().valid(MsgType.CLOSE).required(),
  Joi.string()
    .length(64)
    .regex(/^[0-9a-f]+$/)
    .required(),
);
