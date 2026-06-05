import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

// One-time bootstrap: sets the authenticated user as admin.
// Protected by ADMIN_SETUP_TOKEN env var — delete or unset after first use.
export async function POST(request) {
  const token = process.env.ADMIN_SETUP_TOKEN;
  if (!token) {
    return Response.json({ error: "Not configured" }, { status: 404 });
  }

  const { token: provided } = await request.json().catch(() => ({}));
  if (provided !== token) {
    return Response.json({ error: "Invalid token" }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const email = session.user.email;

  const existing = await sql`SELECT id FROM profiles WHERE id = ${userId} LIMIT 1`;

  if (existing.length > 0) {
    await sql`UPDATE profiles SET role = 'admin' WHERE id = ${userId}`;
  } else {
    await sql`INSERT INTO profiles (id, full_name, role) VALUES (${userId}, ${email}, 'admin')`;
  }

  return Response.json({ success: true, email, message: "User set as admin" });
}
