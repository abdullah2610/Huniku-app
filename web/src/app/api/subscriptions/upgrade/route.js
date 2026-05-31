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

    // Free tier activates immediately; paid plans require admin verification
    if (plan_id === "free") {
      await sql`
        UPDATE profiles
        SET subscription_tier = 'free',
            subscription_expires_at = NULL
        WHERE id = ${session.user.id}
      `;
      await sql`
        UPDATE subscription_transactions
        SET status = 'completed', completed_at = CURRENT_TIMESTAMP
        WHERE id = ${transaction[0].id}
      `;
      return Response.json({
        success: true,
        message: "Paket free berhasil diaktifkan!",
        transaction: transaction[0],
      });
    }

    // Paid plans stay 'pending' until admin verifies payment proof
    return Response.json({
      success: true,
      message: "Menunggu verifikasi pembayaran oleh admin",
      transaction: transaction[0],
    });
  } catch (err) {
    console.error("Upgrade error", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
