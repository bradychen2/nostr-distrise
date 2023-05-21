import * as Joi from 'joi';
import { MsgType } from 'src/domain/constant';

export const FilterSchema = Joi.object({
  ids: Joi.array()
    .items(
      Joi.string()
        .length(64)
        .regex(/^[0-9a-f]+$/),
    )
    .required(),
  authors: Joi.array().items(Joi.string()),
  kinds: Joi.array().items(Joi.number()),
  '#e': Joi.array().items(Joi.string()),
  '#p': Joi.array().items(Joi.string()),
  since: Joi.number(),
  until: Joi.number(),
  limit: Joi.number(),
});

export const ReqSchema = Joi.array()
  .ordered(
    Joi.string().valid(MsgType.REQ).required(),
    Joi.string().max(128).required(),
  )
  .items(FilterSchema.optional());
