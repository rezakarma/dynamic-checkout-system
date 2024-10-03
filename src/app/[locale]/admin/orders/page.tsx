import AddCouponCodes from "@/components/admin/couponCodes/addCouponCodes";

const OrdersPage = () => {
    return ( 
        <div className="flex flex-col justify-center">
        <div className=" pt-5 pr-2 flex justify-between w-full">
          <h2>Orders</h2>
          <AddCouponCodes id={null} />
        </div>
  
        {/* <CouponCodesTable /> */}
     
      </div>
     );
}
 
export default OrdersPage;