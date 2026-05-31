import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan_id, payment_method, payment_proof_url } = body;

    // Get plan details
    const plans =
      await sql`SELECT * FROM subscription_plans WHERE id = ${plan_id}`;
    if (plans.length === 0) {
      return Response.json({ error: "Plan tidak ditemukan" }, { status: 404 });
    }
    const plan = plans[0];

    // Create transaction record
    const transaction = await sql`
      INSERT INTO subscription_transactions (
        user_id, plan_id, amount, payment_method, payment_proof_url, status
      ) VALUES (
        ${session.user.id}, ${plan_id}, ${plan.price}, ${payment_method || "bank_transfer"}, 
        ${payment_proof_url || null}, 'pending'
      ) RETURNING *
    `;

    // For demo purposes, auto-approve free tier or if payment proof uploaded
    if (plan_id === "free" || payment_proof_url) {
      const expiresAt =
        plan_id === "free"
          ? null
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

      await sql`
        UPDATE profiles 
        SET subscription_tier = ${plan_id},
            subscription_expires_at = ${expiresAt}
        WHERE id = ${session.user.id}
      `;

      await sql`
        UPDATE subscription_transactions 
        SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
        WHERE id = ${transaction[0].id}
      `;

      return Response.json({
        success: true,
        message: "Subscription berhasil diaktifkan!",
        transaction: transaction[0],
      });
    }

    return Response.json({
      success: true,
      message: "Menunggu verifikasi pembayaran",
      transaction: transaction[0],
    });
  } catch (err) {
    console.error("Upgrade error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
