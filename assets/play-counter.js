/* 讲解视频播放统计：播放时向百度统计上报事件，后台「事件分析」按视频查看次数。
   事件标签取视频文件名（lustre-deep.mp4 → lustre-deep），首页弹层与子页面计入同一视频。
   百度统计代码在各页面 <head> 中加载；未加载成功时静默跳过，不影响播放。 */
(() => {
  "use strict";
  const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);   // 本地预览不上报
  const KEY = "adg331_played_";

  const idOf = src => {
    const m = /([a-z0-9-]+)\.mp4(?:[?#]|$)/i.exec(src || "");
    return m ? m[1].toLowerCase() : null;
  };

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
    if (!id || LOCAL || seen(id) || !window._hmt) return;
    window._hmt.push(["_trackEvent", "讲解视频", "播放", id]);
  }, true);   // play 不冒泡，用捕获阶段统一监听
})();
