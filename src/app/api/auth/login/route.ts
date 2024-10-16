// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";  // Adjust the path to Prisma client
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",  // Token expires in 1 hour
    });

    // Set the token in HttpOnly cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("token", token, {
      httpOnly: true,  // Ensure the token is not accessible via JavaScript
      secure: process.env.NODE_ENV === "production",  // Secure in production
      maxAge: 60 * 60,  // 1 hour
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
