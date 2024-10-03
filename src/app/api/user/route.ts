import { validateRequest } from "@/auth";
import {  NextResponse } from "next/server";

export const GET = async () => {
  try {
    const UserSession = await validateRequest();
    return NextResponse.json(UserSession);
  } catch {
    return NextResponse.json({ error: "something wrong!" });
  }
};
