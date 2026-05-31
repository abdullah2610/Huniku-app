import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await sql`
      SELECT 
        p.subscription_tier,
        p.subscription_expires_at,
        p.monthly_listings_count,
        p.monthly_views_count,
        sp.name as plan_name,
        sp.max_listings,
        sp.max_photos,
        sp.max_videos,
        sp.badge_label,
        sp.badge_color,
        sp.has_analytics,
        sp.features
      FROM profiles p
      LEFT JOIN subscription_plans sp ON p.subscription_tier = sp.id
      WHERE p.id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    // Count current active listings
    const listings = await sql`
      SELECT COUNT(*) as count 
      FROM properties 
      WHERE owner_id = ${session.user.id} AND is_active = true
    `;

    return Response.json({
      ...profile[0],
      current_listings: parseInt(listings[0].count),
      is_expired: profile[0].subscription_expires_at
        ? new Date(profile[0].subscription_expires_at) < new Date()
        : false,
    });
  } catch (err) {
    console.error("Get status error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
