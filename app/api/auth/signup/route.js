import { registerUser } from "../../../../lib/firebaseAuth";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    const user = await registerUser(name, email, password);

    return new Response(JSON.stringify({ success: true, uid: user.uid }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
