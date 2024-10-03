import { validateRequest } from "@/auth";
import AddCouponCodes from "@/components/admin/couponCodes/addCouponCodes";
import { redirect } from "@/navigation";

const OrdersPage = async () => {
  const { user } = await validateRequest();
  if (!user || user?.role !== "ADMIN") {
    return redirect("/");
  }
  return (
    <div className="flex flex-col justify-center">
      <div className=" pt-5 pr-2 flex justify-between w-full">
        <h2>Orders</h2>
        <AddCouponCodes id={null} />
      </div>

      {/* <CouponCodesTable /> */}
    </div>
  );
};

export default OrdersPage;
