import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const rows = await sql`
      SELECT p.*, pr.full_name as owner_name, pr.avatar_url as owner_avatar, pr.phone_number as owner_phone
      FROM properties p
      LEFT JOIN profiles pr ON p.owner_id = pr.id
      WHERE p.id = ${id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return Response.json(
        { error: "Properti tidak ditemukan" },
        { status: 404 },
      );
    }

    const property = rows[0];

    // Get reviews
    const reviews = await sql`
      SELECT r.*, pr.full_name as user_name, pr.avatar_url as user_avatar
      FROM reviews r
      JOIN profiles pr ON r.user_id = pr.id
      WHERE property_id = ${id}
      ORDER BY created_at DESC
    `;

    return Response.json({ ...property, reviews });
  } catch (err) {
    console.error("Get property error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      address,
      land_size,
      building_size,
      bedrooms,
      bathrooms,
      facilities,
      images,
      is_active,
    } = body;

    const result = await sql`
      UPDATE properties SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        price = COALESCE(${price}, price),
        address = COALESCE(${address}, address),
        land_size = COALESCE(${land_size}, land_size),
        building_size = COALESCE(${building_size}, building_size),
        bedrooms = COALESCE(${bedrooms}, bedrooms),
        bathrooms = COALESCE(${bathrooms}, bathrooms),
        facilities = COALESCE(${JSON.stringify(facilities)}, facilities),
        images = COALESCE(${images}, images),
        is_active = COALESCE(${is_active}, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND owner_id = ${session.user.id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Tidak memiliki akses atau properti tidak ditemukan" },
        { status: 403 },
      );
    }

    return Response.json(result[0]);
  } catch (err) {
    console.error("Update property error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sql`
      DELETE FROM properties 
      WHERE id = ${id} AND owner_id = ${session.user.id}
      RETURNING id
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Tidak memiliki akses atau properti tidak ditemukan" },
        { status: 403 },
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete property error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
