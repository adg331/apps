// 讲解视频播放计数。POST /hit/:id 计 1 次并返回新值；GET /counts 返回全部 {id: n}。
// id 取视频文件名（如 lustre-deep），首页弹层与子页面共用同一计数。
const ORIGINS = ["https://adg331.github.io", "http://localhost:8765"];

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
      "Access-Control-Allow-Methods": "GET, POST",
      "Vary": "Origin",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });

    const { pathname } = new URL(req.url);
    const hit = pathname.match(/^\/hit\/([a-z0-9-]{1,40})$/);

    if (hit && req.method === "POST") {
      // 只接受站点本身发起的上报，挡掉最随意的刷数
      if (!ORIGINS.includes(origin)) return new Response("forbidden", { status: 403, headers: cors });
      const row = await env.DB.prepare(
        "INSERT INTO plays (id, n) VALUES (?1, 1) ON CONFLICT(id) DO UPDATE SET n = n + 1 RETURNING n"
      ).bind(hit[1]).first();
      return Response.json({ n: row.n }, { headers: cors });
    }

    if (pathname === "/counts" && req.method === "GET") {
      const { results } = await env.DB.prepare("SELECT id, n FROM plays").all();
      const out = Object.fromEntries(results.map(r => [r.id, r.n]));
      return Response.json(out, { headers: { ...cors, "Cache-Control": "max-age=30" } });
    }

    return new Response("not found", { status: 404, headers: cors });
  },
};
