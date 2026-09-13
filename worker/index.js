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

function userPayload(user) {
  return { id: user.id, username: user.username, nama: user.nama, role: user.role, kelas: user.kelas, rombel: user.rombel, mapel: user.mapel };
}

async function getUser(env, userId) {
  if (!userId) return null;
  return env.DB.prepare("SELECT id, username, nama, role, kelas, rombel, mapel FROM users WHERE id = ? LIMIT 1").bind(userId).first();
}

async function teacherStudentScope(env, user) {
  const links = await env.DB.prepare("SELECT kelas, rombel FROM guru_rombel WHERE user_id = ? ORDER BY kelas, rombel").bind(user.id).all();
  const access = links?.results || [];
  if (access.length) return access;
  if (user.kelas !== null && user.kelas !== undefined && user.kelas !== "") {
    return [{ kelas: user.kelas, rombel: user.rombel || null }];
  }
  return [];
}

function studentWhere(access, search = "") {
  const params = [];
  const groups = access.map(item => {
    const parts = ["kelas = ?"];
    params.push(item.kelas);
    if (item.rombel) { parts.push("rombel = ?"); params.push(item.rombel); }
    return `(${parts.join(" AND ")})`;
  });
  const where = groups.length ? `(${groups.join(" OR ")})` : "1 = 0";
  const q = String(search || "").trim();
  if (q) {
    const like = `%${q}%`;
    return { where: `${where} AND (nama LIKE ? OR nis LIKE ? OR nisn LIKE ? OR rombel LIKE ?)`, params: [...params, like, like, like, like] };
  }
  return { where, params };
}

async function dashboard(env, userId) {
  const user = await getUser(env, userId);
  if (!user) return json({ ok: false, error: "USER_NOT_FOUND", message: "Sesi guru tidak ditemukan." }, 401);

  const access = await teacherStudentScope(env, user);
  const scoped = studentWhere(access);
  const count = await env.DB.prepare(`SELECT COUNT(*) AS total FROM siswa WHERE ${scoped.where}`).bind(...scoped.params).first();
  const students = await env.DB.prepare(`SELECT id, nis, nisn, nama, kelas, jenis_kelamin, rombel FROM siswa WHERE ${scoped.where} ORDER BY nama LIMIT 8`).bind(...scoped.params).all();

  const nilaiCount = await env.DB.prepare(`SELECT COUNT(*) AS total FROM nilai WHERE siswa_id IN (SELECT id FROM siswa WHERE ${scoped.where})`).bind(...scoped.params).first();
  const kelasList = [...new Set(access.map(x => Number(x.kelas)).filter(Number.isFinite))];
  const perangkatCount = kelasList.length ? await env.DB.prepare(`SELECT COUNT(*) AS total FROM perangkat WHERE kelas IN (${kelasList.map(() => "?").join(",")})`).bind(...kelasList).first() : { total: 0 };
  const rpmCount = kelasList.length ? await env.DB.prepare(`SELECT COUNT(*) AS total FROM rpm WHERE kelas IN (${kelasList.map(() => "?").join(",")})`).bind(...kelasList).first() : { total: 0 };

  return json({
    ok: true,
    user: userPayload(user),
    stats: { students: Number(count?.total || 0), nilai: Number(nilaiCount?.total || 0), perangkat: Number(perangkatCount?.total || 0), rpm: Number(rpmCount?.total || 0) },
    students: students?.results || [],
  });
}

async function students(env, userId, search = "") {
  const user = await getUser(env, userId);
  if (!user) return json({ ok: false, error: "USER_NOT_FOUND", message: "Sesi guru tidak ditemukan." }, 401);
  const access = await teacherStudentScope(env, user);
  const scoped = studentWhere(access, search);
  const result = await env.DB.prepare(`SELECT id, nis, nisn, nama, jenis_kelamin, kelas, rombel FROM siswa WHERE ${scoped.where} ORDER BY kelas, rombel, nama`).bind(...scoped.params).all();
  return json({ ok: true, students: result?.results || [], access });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "Content-Type, Authorization", "access-control-allow-methods": "GET, POST, OPTIONS" } });

    if (url.pathname === "/api/health") {
      let db = false;
      if (env.DB) { try { await env.DB.prepare("SELECT 1").first(); db = true; } catch (_) {} }
      return json({ ok: true, service: "SIAP GURU", worker: true, d1: db });
    }

    if (url.pathname === "/api/auth/login" && request.method === "POST") {
      if (!env.DB) return json({ ok: false, error: "DB_NOT_CONFIGURED" }, 503);
      let body;
      try { body = await request.json(); } catch (_) { return json({ ok: false, error: "INVALID_JSON", message: "Data login tidak valid." }, 400); }
      const nip = String(body?.nip ?? "").trim();
      const password = String(body?.password ?? "");
      if (!nip || !password) return json({ ok: false, error: "MISSING_CREDENTIALS", message: "NIP dan kata sandi wajib diisi." }, 400);
      try {
        const user = await env.DB.prepare("SELECT id, username, password, nama, role, kelas, rombel, mapel FROM users WHERE username = ? LIMIT 1").bind(nip).first();
        if (!user || !(await passwordMatches(password, String(user.password ?? "")))) return json({ ok: false, error: "INVALID_CREDENTIALS", message: "NIP atau kata sandi salah." }, 401);
        return json({ ok: true, user: userPayload(user) });
      } catch (_) { return json({ ok: false, error: "AUTH_DATABASE_ERROR", message: "Autentikasi gagal diproses." }, 500); }
    }

    if (url.pathname === "/api/dashboard" && request.method === "GET") {
      if (!env.DB) return json({ ok: false, error: "DB_NOT_CONFIGURED" }, 503);
      try { return await dashboard(env, url.searchParams.get("user_id")); }
      catch (_) { return json({ ok: false, error: "DASHBOARD_DATABASE_ERROR", message: "Data dashboard gagal dimuat." }, 500); }
    }

    if (url.pathname === "/api/students" && request.method === "GET") {
      if (!env.DB) return json({ ok: false, error: "DB_NOT_CONFIGURED" }, 503);
      try { return await students(env, url.searchParams.get("user_id"), url.searchParams.get("search")); }
      catch (_) { return json({ ok: false, error: "STUDENTS_DATABASE_ERROR", message: "Data siswa gagal dimuat." }, 500); }
    }

    return json({ ok: false, error: "NOT_FOUND" }, 404);
  },
};
