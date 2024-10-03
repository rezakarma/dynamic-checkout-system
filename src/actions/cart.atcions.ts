"use server";
import { validateRequest } from "@/auth";
import { db } from "@/lib/db";

export const getCart = async () => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { error: "you are not logged in" };
    }
    const userCartEixt = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        products: {
          include: {
            product: {
              include: {
                pricingRules: true,
              },
            },
          },
        },
      },
    });

    if (!userCartEixt) {
      const result = await createUserCart();
      if (result.error) {
        return result;
      } else if (result.success) {
        return result.userCart;
      }
    }
    return userCartEixt;
  } catch (error: any) {
    return { error: "resultNotOk" };
  }
};

export const addProductToCart = async (
  type: "byId" | "SKU",
  productId: string
) => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { error: "you are not logged in" };
    }
    const cartExist = await db.cart.findUnique({
      where: { userId: user.id },
    });

    let product = null;
    let error;
    let success;
    if (type === "byId") {
      product = await db.product.findUnique({
        where: { id: productId },
      });
      success = "product added";
      error = "product not found";
    } else if (type === "SKU") {
      product = await db.product.findFirst({
        where: { SKU: productId },
      });
      success = "product added by SKU";
      error = "product with this SKU not found";
    }

    if (!product) {
      return { error: error };
    }

    if (cartExist) {
      const productInCart = await db.productInCart.findFirst({
        where: { cartId: cartExist.id, productId: product.id },
      });
      if (productInCart) {
        const productIsAvalible = productInCart.count < product.quantity;
        if (!productIsAvalible) {
          return { error: "The product is out of stock" };
        }
        const updatedProductInCart = await db.productInCart.update({
          where: { id: productInCart.id },
          include: {
            product: {
              include: {
                pricingRules: true,
              },
            },
          },
          data: {
            count: {
              increment: 1,
            },
          },
        });
        return {
          success: success,
          product: updatedProductInCart,
        };
      } else {
        if (product.quantity < 1) {
          return { error: "The product is out of stock" };
        }
        const newProductInCart = await db.productInCart.create({
          data: {
            cartId: cartExist.id,
            productId: product.id,
          },
          include: {
            product: {
              include: {
                pricingRules: true,
              },
            },
          },
        });
        return {
          success: success,
          product: newProductInCart,
        };
      }
    } else {
      const newCart = await db.cart.create({
        data: {
          userId: user.id,

          products: {
            create: {
              productId: product.id,
            },
          },
        },
        include: {
          products: {
            include: {
              product: {
                include: {
                  pricingRules: true,
                },
              },
            },
          },
        },
      });
      return {
        success: success,
        product: newCart.products[0],
      };
    }
  } catch (error) {
    return { error: "resultNotOk" };
  }
};

export const removeProductFromCart = async (productId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { error: "you are not logged in" };
    }
    const cartExist = await db.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cartExist) {
      return { error: "Cart Not Exist" };
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { error: "productNotExist" };
    }

    const productInCart = await db.productInCart.findFirst({
      where: { cartId: cartExist.id, productId: product.id },
    });

    if (productInCart) {
      if (productInCart.count > 1) {
        const updatedProductInCart = await db.productInCart.update({
          where: { id: productInCart.id },
          data: {
            count: {
              decrement: 1,
            },
          },
          include: {
            product: {
              include: {
                pricingRules: true,
              },
            },
          },
        });
        return {
          success: "productRemoved",
          product: updatedProductInCart,
        };
      } else if (productInCart.count === 1) {
        const deletedProductInCart = await db.productInCart.delete({
          where: { id: productInCart.id },
          include: {
            product: {
              select: {
                id: true,
              },
            },
          },
        });
        return {
          success: "productRemoved",
          product: deletedProductInCart,
        };
      }
    }
    return { error: "unknownError" };
  } catch (error) {
    return { error: "resultNotOk" };
  }
};

export const clearProductCart = async () => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { error: "you are not logged in" };
    }
    const cartExist = await db.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cartExist) {
      return { error: "Cart Not Exist" };
    }
    await db.cart.update({
      where: { userId: user.id },
      data: {
        products: {
          deleteMany: {
            cartId: cartExist.id,
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    return { error: "resultNotOk" };
  }
};

const createUserCart = async () => {
  const { user } = await validateRequest();
  if (!user) {
    return { error: "you are not logged in" };
  }
  const userCart = await db.cart.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return { success: true, userCart };
};
