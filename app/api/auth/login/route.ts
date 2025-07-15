import { loginUser } from '@/lib/firebaseAuth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await loginUser(email, password);

    return Response.json({ success: true, uid: user.uid });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message }, { status: 401 });
  }
}
