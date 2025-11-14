import { OrderHistoryStatus } from '../enum.utils';


export function mapShopifyStatus(financialStatus: string, fulfillmentStatus: string): OrderHistoryStatus {
  switch (true) {
    case financialStatus === 'PENDING':
      return OrderHistoryStatus.PAYMENT;
    case financialStatus === 'PAID' && fulfillmentStatus !== 'FULFILLED':
      return OrderHistoryStatus.IN_PROGRESS;
    case financialStatus === 'PAID' && fulfillmentStatus === 'FULFILLED': // + delivery status
      return OrderHistoryStatus.SHIPPED;
    case financialStatus === 'REFUNDED' || financialStatus === 'PARTIALLY_REFUNDED':
      return OrderHistoryStatus.REFUNDED;
    default:
      return OrderHistoryStatus.INVALID;
  }
}

export function calculateDiscountAmount(
  subTotal: number,
  shippingAmount: number,
  taxAmount: number,
  paymentTotal: number
): number {
  const totalBeforeDiscount = subTotal + shippingAmount + taxAmount;
  const discountAmount = paymentTotal - totalBeforeDiscount;
  return discountAmount;
}

export function parseStorefrontOrderIDtoAdminOrderID(orderID: string): string {
  return orderID.split('?')[0];
}

export function extractShopifyID(gid: string): string {
  const regex = /^gid:\/\/shopify\/\w+\/(\d+)$/;
  const match = gid.match(regex);

  if (!match) {
    throw new Error('Invalid Shopify Global ID format');
  }

  return match[1];
}


