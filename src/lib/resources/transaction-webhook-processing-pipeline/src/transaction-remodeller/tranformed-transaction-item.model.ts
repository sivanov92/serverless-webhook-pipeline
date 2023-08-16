import {BankTransactionsPayload} from "../bank-transactions.types";

export class TranformedTransactionItemModel {
    private readonly PARTITION_KEY = 'PK';
    private readonly SORT_KEY = 'SK';

    private partitionKey: string;
    private sortKey: string;
    private iban: string;
    private amount: number;
    private currency: string;
    private transactionId: string;
    private transactionDate: string;
    private bankName: string;
    private otherData?: any;

    public async create(transactionData: BankTransactionsPayload) {

    }

    protected buildPartitionKey() {

    }
}