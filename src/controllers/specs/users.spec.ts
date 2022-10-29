import {SchemaObject} from '@loopback/rest';

const credentialSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const credentialRequestBody = {
  description: 'The input of login funtion',
  required: true,
  content: {
    'application/json': {
      schema: credentialSchema,
    },
  },
};
