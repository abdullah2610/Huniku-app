import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

async function requireAdmin(session) {
  if (!session?.user?.id) return false;
  const rows = await sql`SELECT role FROM profiles WHERE id = ${session.user.id} LIMIT 1`;
  return rows?.[0]?.role === "admin";
}

export async function PUT(request, { params }) {
  const session = await auth();
  if (!(await requireAdmin(session))) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      listing_mode,
      price,
      address,
      latitude,
      longitude,
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
        title       = COALESCE(${title ?? null}, title),
        description = COALESCE(${description ?? null}, description),
        type        = COALESCE(${type ?? null}::property_type, type),
        listing_mode= COALESCE(${listing_mode ?? null}::listing_type, listing_mode),
        price       = COALESCE(${price ?? null}, price),
        address     = COALESCE(${address ?? null}, address),
        latitude    = COALESCE(${latitude ?? null}, latitude),
        longitude   = COALESCE(${longitude ?? null}, longitude),
        land_size   = COALESCE(${land_size ?? null}, land_size),
        building_size = COALESCE(${building_size ?? null}, building_size),
        bedrooms    = COALESCE(${bedrooms ?? null}, bedrooms),
        bathrooms   = COALESCE(${bathrooms ?? null}, bathrooms),
        facilities  = COALESCE(${facilities ? JSON.stringify(facilities) : null}, facilities),
        images      = COALESCE(${images ?? null}, images),
        is_active   = COALESCE(${is_active ?? null}, is_active),
        updated_at  = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json(
        { error: "Properti tidak ditemukan" },
        { status: 404 },
      );
    }
    return Response.json(result[0]);
  } catch (err) {
    console.error("Admin update property error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!(await requireAdmin(session))) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = params;
  try {
    const result = await sql`
      DELETE FROM properties WHERE id = ${id} RETURNING id
    `;
    if (result.length === 0) {
      return Response.json(
        { error: "Properti tidak ditemukan" },
        { status: 404 },
      );
    }
    return Response.json({ success: true });
  } catch (err) {
    console.error("Admin delete property error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
