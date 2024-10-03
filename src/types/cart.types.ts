import { Cart, orderProduct, PricingRuleType, User } from "@prisma/client";

export type UserCartExist = {
  id: string;
  userId: string;
  user: User;
  products: ProductInCart[];
};

export type ProductInCart = {
  id: string;
  cartId: string;
  cart: Cart;
  productId: string;
  product: Product;
  count: number;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  purchasePrice: number;
  sellPrice: number;
  quantity: number;
  SKU: string;
  pricingRules: PricingRule[];
  description: string | null;
  imageLink: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderProduct: orderProduct[];
  ProductInCart: ProductInCart[];
};

export type PricingRule = {
  id: string;
  name: string;
  type: PricingRuleType;
  description: string | null;
  quantity: number | null;
  price: number | null;
  free: number | null;
  threshold: number | null;
  discount: number | null;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
};

export type customProductInCart = {
  id: string;
  cartId: string;
  cart: Cart;
  productId: string;
  product: {
    id: string;
    name: string;
    brand: string;
    purchasePrice: number;
    sellPrice: number;
    quantity: number;
    SKU: string;
    pricingRules: {
      id: string;
      name: string;
      type: PricingRuleType;
      description: string | null;
      quantity: number | null;
      price: number | null;
      free: number | null;
      threshold: number | null;
      discount: number | null;
      products: Product[];
      createdAt: Date;
      updatedAt: Date;
    }[];
    description: string | null;
    imageLink: string | null;
    createdAt: Date;
    updatedAt: Date;
    orderProduct: orderProduct[];
    ProductInCart: ProductInCart[];
  };
  count: number;
};

export type ProductWihPricingRule = {
  id: string;
  name: string;
  brand: string;
  purchasePrice: number;
  sellPrice: number;
  quantity: number;
  SKU: string;
  pricingRules: {
    id: string;
    name: string;
    type: PricingRuleType;
    description: string | null;
    quantity: number | null;
    price: number | null;
    free: number | null;
    threshold: number | null;
    discount: number | null;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
  }[];
  description: string | null;
  imageLink: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderProduct: orderProduct[];
  ProductInCart: ProductInCart[];
};