import type { AccountEvent } from "@bouzuya/tsukota-account-events";
import type { ErrorObject, JTDSchemaType } from "ajv/dist/jtd";
import Ajv from "ajv/dist/jtd";
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";

const ajv = new Ajv();

const schemaOfAccountEventCommonProps = {
  accountId: { type: "string" },
  at: { type: "string" },
  id: { type: "string" },
  protocolVersion: { type: "uint32" },
} as const;
const schemaOfAccountEventTransactionProps = {
  amount: { type: "string" },
  categoryId: { type: "string" },
  comment: { type: "string" },
  date: { type: "string" },
} as const;
const schema: JTDSchemaType<{
  event: AccountEvent;
  last_event_id: string | null;
}> = {
  properties: {
    event: {
      discriminator: "type",
      mapping: {
        accountCreated: {
          properties: {
            name: { type: "string" },
            owners: { elements: { type: "string" } },
            ...schemaOfAccountEventCommonProps,
          },
        },
        accountDeleted: {
          properties: {
            ...schemaOfAccountEventCommonProps,
          },
        },
        accountUpdated: {
          properties: {
            name: { type: "string" },
            ...schemaOfAccountEventCommonProps,
          },
        },
        categoryAdded: {
          properties: {
            categoryId: { type: "string" },
            name: { type: "string" },
            ...schemaOfAccountEventCommonProps,
          },
        },
        categoryDeleted: {
          properties: {
            categoryId: { type: "string" },
            ...schemaOfAccountEventCommonProps,
          },
        },
        categoryUpdated: {
          properties: {
            categoryId: { type: "string" },
            name: { type: "string" },
            ...schemaOfAccountEventCommonProps,
          },
        },
        ownerAdded: {
          properties: {
            owner: { type: "string" },
            ...schemaOfAccountEventCommonProps,
          },
        },
        ownerRemoved: {
          properties: {
            owner: { type: "string" },
            ...schemaOfAccountEventCommonProps,
          },
        },
        transactionAdded: {
          properties: {
            transactionId: { type: "string" },
            ...schemaOfAccountEventCommonProps,
            ...schemaOfAccountEventTransactionProps,
          },
        },
        transactionDeleted: {
          properties: {
            transactionId: { type: "string" },
            ...schemaOfAccountEventCommonProps,
          },
        },
        transactionUpdated: {
          properties: {
            transactionId: { type: "string" },
            ...schemaOfAccountEventCommonProps,
            ...schemaOfAccountEventTransactionProps,
          },
        },
      },
    },
    last_event_id: { nullable: true, type: "string" },
  },
};
const validate = ajv.compile(schema);

export function validateStoreAccountEventBody(data: unknown): Result<
  {
    event: AccountEvent;
    last_event_id: string | null;
  },
  ErrorObject[]
> {
  if (validate(data)) {
    return ok(data);
  } else {
    const errors = validate.errors;
    if (errors === undefined || errors === null)
      throw new Error("assert(errors !== undefined && errors !== null)");
    return err(errors);
  }
}
