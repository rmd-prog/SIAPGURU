const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "content-type": "application/json; charset=UTF-8",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "Content-Type, Authorization",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    ...extra,
  },
});

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Base64(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  let binary = "";
  for (const b of new Uint8Array(digest)) binary += String.fromCharCode(b);
  return btoa(binary);
}

async function passwordMatches(password, stored) {
  if (stored === password) return true;
  if (!stored) return false;
  const lower = stored.toLowerCase();
  if (/^[0-9a-f]{64}$/.test(lower)) return (await sha256Hex(password)) === lower;
  if (/^[A-Za-z0-9+/]{43}=$/.test(stored)) return (await sha256Base64(password)) === stored;
  return false;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "Content-Type, Authorization",
        "access-control-allow-methods": "GET, POST, OPTIONS",
      },
    });

    if (url.pathname === "/api/health") {
      let db = false;
      if (env.DB) {
        try {
          await env.DB.prepare("SELECT 1").first();
          db = true;
        } catch (_) {}
      }
      return json({ ok: true, service: "SIAP GURU", worker: true, d1: db });
    }

    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      if (!env.DB) return json({ ok: false, error: "DB_NOT_CONFIGURED" }, 503);

      let body;
      try {
        body = await request.json();
      } catch (_) {
        return json({ ok: false, error: "INVALID_JSON", message: "Data login tidak valid." }, 400);
      }

      const nip = String(body?.nip ?? "").trim();
      const password = String(body?.password ?? "");
      if (!nip || !password) {
        return json({ ok: false, error: "MISSING_CREDENTIALS", message: "NIP dan kata sandi wajib diisi." }, 400);
      }

      try {
        const user = await env.DB.prepare(
          "SELECT id, username, password, nama, role, kelas, rombel, mapel FROM users WHERE username = ? LIMIT 1"
        ).bind(nip).first();

        if (!user || !(await passwordMatches(password, String(user.password ?? "")))) {
          return json({ ok: false, error: "INVALID_CREDENTIALS", message: "NIP atau kata sandi salah." }, 401);
        }

        return json({
          ok: true,
          user: {
            id: user.id,
            username: user.username,
            nama: user.nama,
            role: user.role,
            kelas: user.kelas,
            rombel: user.rombel,
            mapel: user.mapel,
          },
        });
      } catch (_) {
        return json({ ok: false, error: "AUTH_DATABASE_ERROR", message: "Autentikasi gagal diproses." }, 500);
      }
    }

    return json({ ok: false, error: "NOT_FOUND" }, 404);
  },
};
