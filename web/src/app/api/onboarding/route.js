import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role, name } = await request.json();
    const userId = session.user.id;

    // Only allow self-assignable roles — admin must be set server-side
    const ALLOWED_ROLES = ['seeker', 'owner'];
    if (!ALLOWED_ROLES.includes(role)) {
      return Response.json({ error: "Role tidak valid" }, { status: 400 });
    }

    // Check if profile exists, if not create it
    const existing =
      await sql`SELECT id, role FROM profiles WHERE id = ${userId} LIMIT 1`;

    if (existing.length > 0) {
      // Prevent downgrading from admin via this endpoint
      if (existing[0].role === 'admin') {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      await sql`
        UPDATE profiles
        SET role = ${role}, full_name = ${name}
        WHERE id = ${userId}
      `;
    } else {
      await sql`
        INSERT INTO profiles (id, full_name, role) 
        VALUES (${userId}, ${name}, ${role})
      `;
    }

    // Also update auth_users name for consistency
    await sql`UPDATE auth_users SET name = ${name} WHERE id = ${userId}`;

    return Response.json({ success: true });
  } catch (err) {
    console.error("Onboarding API error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
