export interface GetOrdersQuery {
    customerId: string;
    period: {
        from: string;
        to: string;
    };
}