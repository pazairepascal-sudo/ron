export async function onRequestPost({ request, env }) {
  const formData = await request.formData();
  const token = formData.get("cf-turnstile-response");

  if (!token) {
    return new Response("Token manquant", { status: 400 });
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token
      })
    }
  );

  const result = await response.json();

  if (!result.success) {
    return new Response("Vérification refusée", { status: 403 });
  }

  return new Response("OK");
}