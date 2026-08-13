export interface GetPaymentsQuery {
    customerId: string;

    period: {
        from: string;
        to: string;
    };
}