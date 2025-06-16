import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const HARDCODED_USER_ID = 'user123';
const HARDCODED_PASSWORD = 'password123';
const AUTH_COOKIE_NAME = 'app_session';

export async function POST(req: NextRequest) {
  try {
   
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { message: 'Invalid Content-Type. Expected application/json.' },
        { status: 415 } 
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const isMatch = username === HARDCODED_USER_ID && password === HARDCODED_PASSWORD;

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    const oneDayInSeconds = 24 * 60 * 60;
    cookies().set(AUTH_COOKIE_NAME, 'user_session_token_example', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: oneDayInSeconds,
      sameSite: 'lax',
    });

    return NextResponse.json(
      { message: 'Login successful.' },
      { status: 200 }
    );
  } catch (error: any) {
    
    console.error('Login API error:', error);
    if (error instanceof SyntaxError) { 
        return NextResponse.json(
            { message: 'Invalid JSON in request body.' },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
