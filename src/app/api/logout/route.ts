import { NextResponse } from 'next/server';
import { deleteSession } from "../../../lib/sessions"
import { revalidatePath } from 'next/cache';

export async function POST() {

  try {
    await deleteSession().then((result)=>{
        if(!result) {
                return NextResponse.json({ success: false, message: 'Error Logging Out',redirect:'/' }, { status: 403 });
        };
    });
    revalidatePath('/');
    return NextResponse.json({ success: true, message: 'logged out succesfully',redirect:'/' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}