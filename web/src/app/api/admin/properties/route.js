import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

async function getSession() {
  try { return await auth(); } catch { return null; }
}

async function requireAdmin(session) {
  if (!session?.user?.id) return false;
  const rows = await sql`SELECT role FROM profiles WHERE id = ${session.user.id} LIMIT 1`;
  return rows?.[0]?.role === "admin";
}

export async function GET() {
  try {
    const session = await getSession();
    if (!(await requireAdmin(session))) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const rows = await sql`
      SELECT p.*, pr.full_name as owner_name
      FROM properties p
      LEFT JOIN profiles pr ON p.owner_id = pr.id
      ORDER BY p.created_at DESC
    `;
    return Response.json(rows);
  } catch (err) {
    console.error("Admin list properties error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
