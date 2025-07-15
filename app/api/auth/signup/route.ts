import { registerUser } from '@/lib/firebaseAuth';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const user = await registerUser(name, email, password);

    return Response.json({ success: true, uid: user.uid });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 400 });
  }
}
