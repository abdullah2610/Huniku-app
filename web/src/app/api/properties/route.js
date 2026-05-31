import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const listing_mode = searchParams.get("mode");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const location = searchParams.get("location");
  const limit = searchParams.get("limit");

  try {
    let query = `
      SELECT
        p.*,
        pr.full_name as owner_name,
        pr.subscription_tier,
        sp.badge_label,
        sp.badge_color
      FROM properties p
      LEFT JOIN profiles pr ON p.owner_id = pr.id
      LEFT JOIN subscription_plans sp ON pr.subscription_tier = sp.id
      WHERE p.is_active = true
    `;
    const values = [];

    if (type) {
      values.push(type);
      query += ` AND type = $${values.length}`;
    }
    if (listing_mode) {
      values.push(listing_mode);
      query += ` AND listing_mode = $${values.length}`;
    }
    if (minPrice) {
      values.push(minPrice);
      query += ` AND price >= $${values.length}`;
    }
    if (maxPrice) {
      values.push(maxPrice);
      query += ` AND price <= $${values.length}`;
    }
    if (location) {
      values.push(`%${location}%`);
      query += ` AND address ILIKE $${values.length}`;
    }

    // Priority: business tier first, then pro, then free, then by created_at
    query += ` ORDER BY 
      CASE pr.subscription_tier 
        WHEN 'business' THEN 1 
        WHEN 'pro' THEN 2 
        ELSE 3 
      END,
      p.created_at DESC
    `;

    if (limit) {
      values.push(limit);
      query += ` LIMIT $${values.length}`;
    }

    const rows = await sql(query, values);
    return Response.json(rows);
  } catch (err) {
    console.error("List properties error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is owner
    const profiles =
      await sql`SELECT role FROM profiles WHERE id = ${session.user.id}`;
    if (profiles?.[0]?.role !== "owner") {
      return Response.json(
        { error: "Hanya pemilik yang dapat membuat iklan" },
        { status: 403 },
      );
    }

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
      video_url,
    } = body;

    const result = await sql`
      INSERT INTO properties (
        owner_id, title, description, type, listing_mode, price, address,
        latitude, longitude, land_size, building_size, bedrooms,
        bathrooms, facilities, images, video_url, is_active
      ) VALUES (
        ${session.user.id}, ${title}, ${description}, ${type}, ${listing_mode}, ${price}, ${address},
        ${latitude}, ${longitude}, ${land_size}, ${building_size}, ${bedrooms},
        ${bathrooms}, ${JSON.stringify(facilities)}, ${images}, ${video_url}, true
      ) RETURNING *
    `;

    return Response.json(result[0]);
  } catch (err) {
    console.error("Create property error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
