import * as Joi from 'joi';

const hexStrRegex = /^[0-9a-f]+$/;

export const EventDetailSchema = Joi.object({
  id: Joi.string().length(64).regex(hexStrRegex).required(),
  pubkey: Joi.string().length(64).regex(hexStrRegex).required(),
  created_at: Joi.number().required(),
  kind: Joi.number().required(),
  tags: Joi.array().items(Joi.array().items(Joi.string())).required(),
  content: Joi.string().required(),
  sig: Joi.string().length(128).regex(hexStrRegex).required(),
});

export const EventSchema = Joi.array()
  .ordered(Joi.string().allow('EVENT').required())
  .items(EventDetailSchema.required());
