import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
const AUTH_COOKIE_NAME = 'app_session'; 

export async function POST() {
  try {
   
    cookies().set(AUTH_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: -1, 
      sameSite: 'lax', 
    });

    return NextResponse.json({ message: 'Logout successful.' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Logout failed.' }, { status: 500 });
  }
}
