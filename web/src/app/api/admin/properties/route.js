import sql from "@/app/api/utils/sql";

// GET all properties (admin, no auth required for demo)
export async function GET() {
  try {
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
