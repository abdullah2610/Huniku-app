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

    const [userCount, propertyStats] = await Promise.all([
      sql`SELECT COUNT(*) as total FROM profiles`,
      sql`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE is_active = true) as active,
          COUNT(*) FILTER (WHERE is_active = false) as inactive,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_this_month
        FROM properties
      `,
    ]);

    return Response.json({
      users: Number(userCount[0]?.total ?? 0),
      properties: {
        total: Number(propertyStats[0]?.total ?? 0),
        active: Number(propertyStats[0]?.active ?? 0),
        inactive: Number(propertyStats[0]?.inactive ?? 0),
        new_this_month: Number(propertyStats[0]?.new_this_month ?? 0),
      },
    });
  } catch (err) {
    console.error("Admin stats error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
