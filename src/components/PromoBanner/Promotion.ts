export interface Promotion {
  promoId: string;
  title: string;
  description: string;
  discount: number;
}

export const PROMOTION_UNKNOWN = Symbol("PROMOTION_UNKNOWN");
