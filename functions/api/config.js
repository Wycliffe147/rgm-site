// GET /api/config
// Returns public configuration values (e.g., PayChangu public key) from environment variables.
// The public key is safe to expose to the frontend — it is NOT a secret.
const PAYCHANGU_PUBLIC_KEY_FALLBACK = "PUB-LIVE-VbwEYqIPZ0Lmu34aJC3ZXAyTEtPs6KTS";
const PAYPAL_DONATE_URL_FALLBACK = "https://www.paypal.com/donate";

export async function onRequestGet({ env }) {
  return Response.json({
    paychanguPublicKey: env.PAYCHANGU_PUBLIC_KEY || PAYCHANGU_PUBLIC_KEY_FALLBACK,
    paypalDonateUrl: env.PAYPAL_DONATE_URL || PAYPAL_DONATE_URL_FALLBACK
  });
}
