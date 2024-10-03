"use client";
import {
  BadgeDollarSign,
  LayoutDashboard,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";

import AdminMenuItem from "./adminMenuItem";
import { Separator } from "../ui/separator";

const AdminMenu = () => {
  return (
    <>
      <div className="xs:hidden px-2 py-3 sm:w-1/3 md:w-1/4 lg:w-2/6 xl:1/6  h-full  xxs:fixed xxs:bottom-0 xxs:items-end xxs:left-0 xxs:flex xxs:w-screen xxs:bg-white xxs:h-fit xxs:flex-col xxs:z-50 xxs:py-0">
        <Separator />
        <div className="flex flex-col gap-3 w-full xxs:justify-between xxs:flex-row xxs:bg-white xxs:py-2">
          <AdminMenuItem href="/admin" text="dashboard">
            <LayoutDashboard />
          </AdminMenuItem>

          <AdminMenuItem href="/admin/products" text="products">
            <Package />
          </AdminMenuItem>

          <AdminMenuItem href="/admin/pricing-rules" text="pricingRules">
            <BadgeDollarSign />
          </AdminMenuItem>

          <AdminMenuItem href="/admin/orders" text="orders">
            <ShoppingCart />
          </AdminMenuItem>

          <AdminMenuItem href="/admin/users" text="users">
            <User />
          </AdminMenuItem>
        </div>
        <Separator orientation="vertical" className="" />
      </div>

      <div className="flex px-2 py-3 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:1/6  h-full xxs:hidden xs:flex">
        <div className="flex flex-col gap-3 w-full ">
          <AdminMenuItem href="/admin" text="dashboard">
            <LayoutDashboard />
          </AdminMenuItem>

          <AdminMenuItem href="/admin/products" text="products">
            <Package />
          </AdminMenuItem>

          <AdminMenuItem href="/admin/pricing-rules" text="pricingRules">
            <BadgeDollarSign />
          </AdminMenuItem>

          <AdminMenuItem href="/admin/orders" text="orders">
            <ShoppingCart />
          </AdminMenuItem>

          <AdminMenuItem href="/admin/users" text="users">
            <User />
          </AdminMenuItem>
        </div>
        <Separator orientation="vertical" className="" />
      </div>
    </>
  );
};

export default AdminMenu;
