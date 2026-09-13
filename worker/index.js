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
      return json({ ok: false, error: "AUTH_NOT_READY", message: "Autentikasi guru belum diaktifkan. Binding D1 harus dikonfigurasi terlebih dahulu." }, 503);
    }

    return json({ ok: false, error: "NOT_FOUND" }, 404);
  },
};
