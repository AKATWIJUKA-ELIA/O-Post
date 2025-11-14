import { NextRequest, NextResponse } from 'next/server';
import { createSession } from "../../../lib/sessions"
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function POST(req: NextRequest) {
  const { userId, role, isVerified } = await req.json();
  try {
    await createSession(userId, role, isVerified);
    revalidatePath('/');
//     if(role==="admin"){
//         return redirect('/admin' );
//     }
    return NextResponse.json({ success: true, message: 'Session created' }, { status: 200 });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}