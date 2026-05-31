import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { booking_id, amount, payment_method } = await request.json();

    // Create payment record
    const result = await sql`
      INSERT INTO payments (booking_id, amount, status, payment_method)
      VALUES (${booking_id}, ${amount}, 'paid', ${payment_method})
      RETURNING *
    `;

    // Update booking status
    await sql`
      UPDATE bookings SET status = 'confirmed' WHERE id = ${booking_id}
    `;

    return Response.json(result[0]);
  } catch (err) {
    console.error("Payment API error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rows = await sql`
      SELECT pay.*, b.visit_date, p.title as property_title
      FROM payments pay
      JOIN bookings b ON pay.booking_id = b.id
      JOIN properties p ON b.property_id = p.id
      WHERE b.seeker_id = ${session.user.id} OR p.owner_id = ${session.user.id}
      ORDER BY pay.created_at DESC
    `;

    return Response.json(rows);
  } catch (err) {
    console.error("Get payments error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
