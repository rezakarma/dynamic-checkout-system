import { validateRequest } from "@/auth";
import SignupForm from "@/components/auth/signupForm";
import { redirect } from "@/navigation";
import { CircleUser } from "lucide-react";

const SignupPage = async () => {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }
  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="h-full w-1/2 bg-black flex justify-center items-center">
        <CircleUser color="white" size={300} />
      </div>
      <SignupForm />
    </div>
  );
};

export default SignupPage;
