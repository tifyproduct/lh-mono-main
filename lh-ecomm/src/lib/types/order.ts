import type { CurrencyAmount } from './currency';

export interface ShippingAddressDetails {
    firstName: string;
    lastName: string;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    province: string;
    country: string;
    zip: string;
}

export interface OrderPaymentDetails {
    subtotalAmount: CurrencyAmount;
    shippingAmount: CurrencyAmount;
    discountAmount: CurrencyAmount;
    paymentTotal: CurrencyAmount;
    totalRefundedAmount?: CurrencyAmount;
    paymentDueDate?: string;
}

export interface OrderProductDetail {
    productID: string;
    productVariantID: string;
    quantity: number;
    name: string;
    brandName: string;
    imageURL: string;
    variant: string;
    handle: string;
    typeLowerCase: string;
    price: CurrencyAmount;
    shippingDetail: {
        companyName: string;
        logoURL?: string;
        trackingID: string;
        trackingURL: string;
    }

}

export interface OrderData {
    adminAPIID: string;
    number: string;
    orderedAt: string;
    status: string;
    steps: OrderStatusStep[];
    totalItems: number;
    checkoutURL: string;
    paymentDetails: OrderPaymentDetails;
    shippingAddress: ShippingAddressDetails;
    productDetails: OrderProductDetail[];

}

export interface OrderStatusStep {
    status: string;
    timestamp?: string;
    isActive: boolean;
}

// from mongodb collections

export interface OrderPayment {
  orderId: string;
  order: {
    id: string;
    name: string;
    paymentTerms: {
      dueInDays: number;
      overdue: boolean;
      paymentSchedules: {
        nodes: Array<{
          dueAt: Date;
          issuedAt: Date;
        }>;
      };
    };
  };
}
