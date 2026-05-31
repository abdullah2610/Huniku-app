import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const otherUserId = searchParams.get("otherUserId");

    let rows;
    if (propertyId && otherUserId) {
      // Get messages between two users for a specific property
      rows = await sql`
        SELECT m.*, pr.full_name as sender_name 
        FROM messages m
        JOIN profiles pr ON m.sender_id = pr.id
        WHERE property_id = ${propertyId} 
        AND ((sender_id = ${userId} AND receiver_id = ${otherUserId}) OR (sender_id = ${otherUserId} AND receiver_id = ${userId}))
        ORDER BY created_at ASC
      `;
    } else {
      // Get list of conversations
      rows = await sql`
        SELECT DISTINCT ON (property_id, least(sender_id, receiver_id), greatest(sender_id, receiver_id))
          m.*, 
          p.title as property_title,
          pr_other.full_name as other_user_name
        FROM messages m
        JOIN properties p ON m.property_id = p.id
        JOIN profiles pr_other ON (CASE WHEN m.sender_id = ${userId} THEN m.receiver_id ELSE m.sender_id END) = pr_other.id
        WHERE sender_id = ${userId} OR receiver_id = ${userId}
        ORDER BY property_id, least(sender_id, receiver_id), greatest(sender_id, receiver_id), created_at DESC
      `;
    }

    return Response.json(rows);
  } catch (err) {
    console.error("Chat API error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { property_id, receiver_id, content } = await request.json();
    const sender_id = session.user.id;

    const result = await sql`
      INSERT INTO messages (property_id, sender_id, receiver_id, content)
      VALUES (${property_id}, ${sender_id}, ${receiver_id}, ${content})
      RETURNING *
    `;

    return Response.json(result[0]);
  } catch (err) {
    console.error("Post message error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
