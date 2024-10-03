import { Fingerprint } from "lucide-react";
import LoginForm from "../../../components/auth/loginForm";
import { validateRequest } from "@/auth";
import { redirect } from "@/navigation";

const LoginPage = async () => {
  const {user} = await validateRequest();
  if(user) {
    redirect('/')
  }
  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="h-full w-1/2 bg-black flex justify-center items-center">
        <Fingerprint color="white" size={300}/>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
