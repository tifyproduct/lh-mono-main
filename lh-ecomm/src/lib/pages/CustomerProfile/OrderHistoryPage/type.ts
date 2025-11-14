export type OrderHistoryPageState = 'list' | 'detail';

export type OrderHistoryStatus = 'PAYMENT' | 'IN PROGRESS' | 'SHIPPED' | 'COMPLETED' | 'REFUNDED';

export type OrderHistoryStatusHeader = {
  status: string;
  count: number
};

export type OrderShippingAddress = {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip: string | null;
}

export type OrderPaymentDetails = {
  subtotalAmount: {
    amount: string;
    currencyCode: string;
  },
  shippingAmount: {
    amount: string;
    currencyCode: string;
  },
  discountAmount: {
    amount: string;
    currencyCode: string;
  },
  paymentTotal: {
    amount: string;
    currencyCode: string;
  },
  totalRefundedAmount: {
    amount: string;
    currencyCode: string;
  }
  paymentDueDate: string;
}

export type OrderProductDetails = {
  productID: string;
  productVariantID: string;
  quantity: number;
  name: string;
  brandName: string;
  imageURL: string;
  variant: string;
  typeLowerCase: string;
  handle: string;
  price: {
    amount: string;
    currencyCode: string;
  },
  shippingDetail: {
    companyName: string;
    trackingURL: string;
    trackingID: string;
  }
}

export type OrderHistoryDataItem = {
  number: string;
  orderedAt: string;
  paymentDetails: OrderPaymentDetails;
  productDetails: OrderProductDetails[];
  shippingAddress: OrderShippingAddress;
  checkoutURL: string;
}

export type OrderHistoryItem = {
  status: string;
  count: number;
  data: OrderHistoryDataItem[];
}
