export type CartItem = {
  quantity: number,
  id: string,
  merchandise: {
    id: string,
    image: {
      url: string,
    },
    title: string,
    product: {
      title: string,
      vendor: string,
    },
    price: {
      amount: string
    }
  },
  cost: {
    amountPerQuantity: null | {
      amount: string,
      currencyCode: string
    },
    compareAtAmountPerQuantity: null | {
      amount: string,
      currencyCode: string
    },
    subtotalAmount: null | {
      amount: string,
      currencyCode: string
    },
    totalAmount: null | {
      amount: string,
      currencyCode: string
    },
  },
  discountAllocations: [] | {
    discountedAmount: {
      amount: string,
      currencyCode: string,
    },
    __typename: string,
    title: string,
    targetType: string,
  }[]
}

export type DiscountedAmount = {
  discountedAmount: {
    amount: string
    currencyCode: string
  }
}

export type CartToastState = 'warning' | 'success' | 'info'