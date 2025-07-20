import { getAuth } from "firebase-admin/auth";

export async function POST(req) {
  const { email } = await req.json();
  try {
    await getAuth().generatePasswordResetLink(email);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
