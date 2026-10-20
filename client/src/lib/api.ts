export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/$/, "");

export type ContactPayload = {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  company?: string; // honeypot, must stay empty
};

/**
 * Render's free tier sleeps after ~15 idle minutes and takes up to a minute
 * to wake. Pinging on page load means the API is usually awake by the time
 * someone finishes typing a message. Fire-and-forget; failures are ignored.
 */
export function wakeApi() {
  fetch(`${API_URL}/api/health`, { cache: "no-store" }).catch(() => {});
}

export async function sendContact(payload: ContactPayload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 75_000);
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "The message couldn't be sent. Try again, or email me directly.");
    return data as { ok: true };
  } catch (err) {
    if ((err as Error).name === "AbortError" || err instanceof TypeError) {
      throw new Error("The server didn't respond. Email me directly at the address on the left, or try again in a minute.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
