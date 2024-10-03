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
    <div className="flex px-2 py-3 w-1/6 h-full">
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
  );
};

export default AdminMenu;
