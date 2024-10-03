/* eslint-disable */
/* @ts-nocheck */
"use server";

import { loginSchemaWithUsername, signupClientSchema } from "@/schema";
import { z } from "zod";
import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { db } from "@/lib/db";
import { lucia, validateRequest } from "@/auth";
import { cookies } from "next/headers";
export const signUp = async (values: z.infer<typeof signupClientSchema>) => {
  const validatedFields = signupClientSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const passwordHash = await hash(values.password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = generateIdFromEntropySize(10);

  try {
    const userNameExist = await db.user.findUnique({
      where: { userName: values.userName },
    });

    const userEmailExist = await db.user.findUnique({
      where: { email: values.email },
    });

    if (userNameExist) {
      return { error: "usernameExist" };
    }

    if (userEmailExist) {
      return { error: "emailExist" };
    }

    const newUser = await db.user.create({
      data: {
        id: userId,
        email: values.email,
        userName: values.userName,
        password_hash: passwordHash,
      },
    });

    const session = await lucia.createSession(newUser.id, {
      expiresAt: new Date(new Date().getTime() + 60 * 60 * 24 * 30),
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
};

export const login = async (
  values: z.infer<typeof loginSchemaWithUsername>
) => {
  try {
    const userExist = await db.user.findUnique({
      where: { userName: values.userName },
    });

    if (!userExist) {
      return { error: "invalidLogin" };
    }

    const validPassword = await verify(
      userExist.password_hash,
      values.password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      }
    );
    if (!validPassword) {
      return { error: "invalidLogin" };
    }
    const session = await lucia.createSession(userExist.id, {
      expiresAt: new Date(new Date().getTime() + 60 * 60 * 24 * 30),
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();
    if (!session) {
      return { error: "Unauthorized" };
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
};
