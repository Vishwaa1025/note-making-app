import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// List of protected routes
const protectedRoutes = ['/dashboard', '/notes'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Check if the user is accessing a protected route
  if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
    // If no token found, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify JWT token
      jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      // If verification fails, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Continue request if token is valid or route is not protected
  return NextResponse.next();
}

// Specify which paths the middleware should apply to
export const config = {
  matcher: ['/dashboard', '/notes'], // Add any other protected routes here
};
