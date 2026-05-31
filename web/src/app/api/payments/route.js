import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { booking_id, payment_method } = await request.json();

    // Verify booking belongs to this user and get authoritative price
    const bookings = await sql`
      SELECT b.*, p.price as property_price
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE b.id = ${booking_id} AND b.seeker_id = ${session.user.id}
      LIMIT 1
    `;
    if (bookings.length === 0) {
      return Response.json({ error: "Booking tidak ditemukan" }, { status: 404 });
    }
    const booking = bookings[0];
    // Use server-side price, never trust client-supplied amount
    const amount = booking.property_price;

    // Create payment record as pending — mark paid only after gateway webhook
    const result = await sql`
      INSERT INTO payments (booking_id, amount, status, payment_method)
      VALUES (${booking_id}, ${amount}, 'pending', ${payment_method})
      RETURNING *
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
