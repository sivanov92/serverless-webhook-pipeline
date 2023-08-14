import Ajv, {Schema} from "ajv";

const bankTransactionsSchema: Schema = {
    type: "object",
    properties: {
        bank_account_id: {
            type: "string",
        },
        iban: {
            type: "string",
        },
        bank_name: {
            type: "string",
        },
        currency: {
            type: "string",
        },
        items: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    transaction_id: {
                        type: "string",
                    },
                    amount: {
                        type: "number",
                    },
                    sender: {
                        type: "string",
                    },
                    statement_descriptor: {
                        type: "string",
                    }
                }
            }
        }
    },
    required: [
        "bank_account_id",
        "iban",
        "bank_name",
        "currency",
        "items"
    ],
    additionalProperties: false
};

export const validateBankTransactions = (bankTransactions: any): boolean => {
    const ajv = new Ajv();
    const validate = ajv.compile(bankTransactionsSchema);
    const transactionsAreValid = validate(bankTransactions);
    if (!transactionsAreValid) {
        throw new Error(`Bank transactions are invalid: ${JSON.stringify(validate.errors)}`);
    }

    return true;
}