/* 讲解视频播放计数：在视频按钮旁显示总播放次数，并在播放时上报。
   计数 id 取视频文件名（lustre-deep.mp4 → lustre-deep），首页弹层与子页面共用同一计数。
   后端见 workers/play-counter；接口不可达时静默降级，不影响播放。 */
(() => {
  "use strict";
  const API = "https://play-counter.play-counter.workers.dev";
  const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);   // 本地预览只显示不上报
  const KEY = "adg331_played_";

  const idOf = src => {
    const m = /([a-z0-9-]+)\.mp4(?:[?#]|$)/i.exec(src || "");
    return m ? m[1].toLowerCase() : null;
  };
  const fmt = n => n.toLocaleString("zh-CN");

  const style = document.createElement("style");
  style.textContent = ".pc-n{font-size:.82em;font-weight:600;opacity:.68;margin-left:6px;font-variant-numeric:tabular-nums}";
  document.head.appendChild(style);

  // 需要显示次数的按钮：首页 [data-video]，子页面 #vOpen（对应 #vPlayer）
  const targets = [];
  document.querySelectorAll("[data-video]").forEach(el => targets.push([el, idOf(el.dataset.video)]));
  const open = document.getElementById("vOpen"), player = document.getElementById("vPlayer");
  if (open && player) targets.push([open, idOf(player.getAttribute("src"))]);

  const counts = {};
  function render() {
    targets.forEach(([el, id]) => {
      if (!id || !counts[id]) return;
      let span = el.querySelector(".pc-n");
      if (!span) {
        span = document.createElement("span");
        span.className = "pc-n";
        el.appendChild(span);
      }
      span.textContent = "· " + fmt(counts[id]) + " 次播放";
    });
  }

  // 本地预览加 ?pc-demo 填示例数字看样式，不碰真实计数
  if (LOCAL && /[?&]pc-demo\b/.test(location.search)) {
    targets.forEach(([, id], i) => { if (id) counts[id] = [1286, 37, 452, 8, 2031][i % 5]; });
    render();
    return;
  }

  fetch(API + "/counts", { signal: AbortSignal.timeout(6000) })
    .then(r => r.ok ? r.json() : {})
    .then(data => { Object.assign(counts, data); render(); })
    .catch(() => {});

  // 同一浏览器会话内每个视频只计一次，暂停续播、重复打开弹层都不重复计
  function seen(id) {
    try {
      if (sessionStorage.getItem(KEY + id)) return true;
      sessionStorage.setItem(KEY + id, "1");
    } catch (e) {}
    return false;
  }

  document.addEventListener("play", e => {
    const v = e.target;
    if (!(v instanceof HTMLVideoElement)) return;
    const id = idOf(v.currentSrc || v.getAttribute("src"));
    if (!id || LOCAL || seen(id)) return;
    fetch(API + "/hit/" + id, { method: "POST", keepalive: true })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.n) { counts[id] = d.n; render(); } })
      .catch(() => {});
  }, true);   // play 不冒泡，用捕获阶段统一监听
})();
