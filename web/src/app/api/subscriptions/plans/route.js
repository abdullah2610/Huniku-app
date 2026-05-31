import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const plans = await sql`
      SELECT * FROM subscription_plans 
      WHERE is_active = true 
      ORDER BY price ASC
    `;
    return Response.json(plans);
  } catch (err) {
    console.error("Get plans error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
