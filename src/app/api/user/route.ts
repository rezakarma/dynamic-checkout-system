import { validateRequest } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const UserSession = await validateRequest();
    return NextResponse.json(UserSession);
  } catch (error) {
    return NextResponse.json({ error: "something wrong!" });
  }
};
