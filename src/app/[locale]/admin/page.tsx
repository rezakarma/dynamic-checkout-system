import { validateRequest } from "@/auth";
import { redirect } from "@/navigation";

const AdminPage = async () => {
    const { user } = await validateRequest();
    if (!user || user?.role !== "ADMIN") {
      return redirect("/");
    }
    return ( 
        <div></div>
     );
}
 
export default AdminPage;