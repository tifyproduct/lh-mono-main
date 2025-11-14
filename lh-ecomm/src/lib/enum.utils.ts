export enum OrderHistoryStatus {
    PAYMENT = 'PAYMENT',
    IN_PROGRESS = 'IN_PROGRESS',
    SHIPPED = 'SHIPPED',
    REFUNDED = 'REFUNDED',
    INVALID = 'INVALID'
}

export function isOrderHistoryStatus(status: unknown): status is OrderHistoryStatus {
    return Object.values(OrderHistoryStatus).includes(status as OrderHistoryStatus);
}

export const OrderHistoryStatusValues: Record<OrderHistoryStatus, string> = {
    [OrderHistoryStatus.PAYMENT]: 'Payment',
    [OrderHistoryStatus.IN_PROGRESS]: 'In Progress',
    [OrderHistoryStatus.SHIPPED]: 'Shipped',
    [OrderHistoryStatus.REFUNDED]: 'Refunded',
    [OrderHistoryStatus.INVALID]: 'Invalid'
};