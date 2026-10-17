/* Client-side visual gate only; page source and assets remain public. */
(() => {
  "use strict";
  const EXPECTED_HASH = "53d8ab0c908b84d1203dbdffb1fc44748517dc67280e8f85b2cf8bd157134bdd";
  const SESSION_KEY = "adg331_apps_access_v1";

  // 已验证状态同时记在 sessionStorage 和会话 Cookie 里。
  // 只用 sessionStorage 不行：卡片以 <a target="_blank"> 打开，
  // 而 target="_blank" 在现代浏览器里隐含 noopener，新标签页
  // 拿到的是全新的 sessionStorage，于是每个子页面都会重新弹门。
  // 会话 Cookie 由 Cookie 模型保证同源各标签页共享，且不设
  // Max-Age/Expires，关闭浏览器即失效，生命周期与 sessionStorage 一致。
  // Cookie 作用域取脚本自身所在的站点根，避免泄漏到同域的其他项目。
  const SCOPE = (() => {
    try {
      const src = document.currentScript && document.currentScript.src;
      if (src) return new URL("../", src).pathname;   // <root>/assets/ 的上一级
    } catch (e) {}
    return "/";
  })();

  function cookieSet() {
    return document.cookie.split("; ").indexOf(SESSION_KEY + "=1") !== -1;
  }

  function remember() {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) {}
    document.cookie = SESSION_KEY + "=1; path=" + SCOPE + "; SameSite=Lax";
  }

  function verified() {
    try { if (sessionStorage.getItem(SESSION_KEY) === "1") return true; } catch (e) {}
    return cookieSet();
  }

  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
  }

  const ICON = {
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2.2"/><path class="access-gate__shackle" d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7"/><path d="M12 14.6v2.2"/></svg>',
    eyeOn: '<svg class="access-gate__eye-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/></svg>',
    eyeOff: '<svg class="access-gate__eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4l16 16"/><path d="M9.9 5.8A8.6 8.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.9 3.7M14.6 17.9a8.4 8.4 0 0 1-2.6.6C6 18.5 2.5 12 2.5 12a16 16 0 0 1 3.9-4.5"/><path d="M9.9 10a2.8 2.8 0 0 0 4 4"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>'
  };

  const REDUCED = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const WARP_AT = 160;    // 解锁后多久开始“跃迁”
  const IRIS_AT = 380;    // 多久开始开圆形光圈
  const IRIS_MS = 480;

  function buildGate() {
    const gate = document.createElement("div");
    gate.className = "access-gate";
    gate.id = "accessGate";
    gate.innerHTML = `
      <div class="access-gate__aurora" aria-hidden="true"></div>
      <canvas class="access-gate__fx" aria-hidden="true"></canvas>
      <div class="access-gate__brand"><span class="access-gate__led" aria-hidden="true"></span>NETAPP / DEMO BAY</div>
      <div class="access-gate__stage">
        <div class="access-gate__tilt">
          <div class="access-gate__glow" aria-hidden="true"></div>
          <div class="access-gate__frame">
            <form class="access-gate__box" id="accessGateForm" autocomplete="on" novalidate>
              <div class="access-gate__addr"><b>Access</b><span class="access-gate__state" id="accessGateState">已锁定</span></div>
              <div class="access-gate__body">
                <div class="access-gate__icon">${ICON.lock}</div>
                <h1>访问验证</h1>
                <p>演示内容仅面向受邀访客，输入访问密码后进入。</p>
                <label class="access-gate__label" for="accessGatePassword">访问密码
                  <span class="access-gate__caps" id="accessGateCaps" hidden>大写锁定已开启</span>
                </label>
                <div class="access-gate__field">
                  <input id="accessGatePassword" type="password" placeholder="请输入访问密码" autocomplete="current-password" autocapitalize="off" spellcheck="false" aria-describedby="accessGateError">
                  <button type="button" class="access-gate__toggle" id="accessGateToggle" aria-label="显示密码" aria-pressed="false">${ICON.eyeOn}${ICON.eyeOff}</button>
                </div>
                <div class="access-gate__error" id="accessGateError" role="alert" aria-live="polite"></div>
                <button type="submit" class="access-gate__submit" id="accessGateSubmit"><span>进入演示</span>${ICON.arrow}</button>
              </div>
              <span class="access-gate__contact">没有密码？请联系 <a href="mailto:enyang.fu@lenovonetapp.com">enyang.fu@lenovonetapp.com</a></span>
            </form>
            <div class="access-gate__glare" aria-hidden="true"></div>
          </div>
        </div>
      </div>
      <p class="access-gate__note">验证在本次浏览器会话内有效</p>`;
    document.body.prepend(gate);
    return gate;
  }

  // ── 背景动效：节点网络 + 沿连线流动的数据点 + 涟漪 + 解锁时的跃迁 ──
  // 全部画在一张 canvas 上，门隐藏后即停；减少动态效果偏好下整层不启动。
  function startFx(gate) {
    const canvas = gate.querySelector(".access-gate__fx");
    const ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx || REDUCED) return { ripple() {}, warp() {}, hole() {}, stop() {} };

    const LINK = 132;
    const KINDS = {
      key:   { speed: 520,  force: 240, color: "#8edcff", max: () => 230 },
      error: { speed: 900,  force: 900, color: "#ff8f85", max: () => Math.hypot(w, h) * .6 },
      open:  { speed: 1500, force: 0,   color: "#ffffff", max: () => Math.hypot(w, h) }
    };
    const pointer = { x: 0, y: 0, on: false };
    let w = 0, h = 0, nodes = [], pulses = [], ripples = [];
    let running = true, last = 0, warp = null, hole = null;

    function makeNode() {
      const a = Math.random() * Math.PI * 2, s = 5 + Math.random() * 13, z = .35 + Math.random() * .65;
      const x = Math.random() * w, y = Math.random() * h;
      return { x, y, px: x, py: y, bx: Math.cos(a) * s, by: Math.sin(a) * s, ix: 0, iy: 0, z, r: .7 + z * 1.6 };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const want = Math.max(36, Math.min(130, Math.round(w * h / 13000)));
      while (nodes.length < want) nodes.push(makeNode());
      nodes.length = want;
      pulses = [];
    }

    function update(dt, wt) {
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r += ripples[i].speed * dt;
        if (ripples[i].r >= ripples[i].max) ripples.splice(i, 1);
      }
      for (const n of nodes) {
        n.px = n.x; n.py = n.y;
        if (warp) {
          // 跃迁：所有节点从卡片中心向外加速，飞出屏幕的回到中心附近重新出发
          const dx = n.x - warp.x, dy = n.y - warp.y, d = Math.hypot(dx, dy) || 1;
          const acc = (260 + wt * 5200) * n.z;
          n.ix += dx / d * acc * dt; n.iy += dy / d * acc * dt;
        } else if (pointer.on) {
          const dx = n.x - pointer.x, dy = n.y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < 22500 && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / 150) * 46 * dt; n.ix += dx / d * f; n.iy += dy / d * f; }
        }
        for (const r of ripples) {
          if (!r.force) continue;
          const dx = n.x - r.x, dy = n.y - r.y, d = Math.hypot(dx, dy) || 1;
          if (Math.abs(d - r.r) < 26) { const f = r.force * (1 - r.r / r.max) * dt; n.ix += dx / d * f; n.iy += dy / d * f; }
        }
        n.x += (n.bx + n.ix) * dt; n.y += (n.by + n.iy) * dt;
        if (warp) {
          if (n.x < -60 || n.x > w + 60 || n.y < -60 || n.y > h + 60) {
            const a = Math.random() * Math.PI * 2, d = 20 + Math.random() * 110;
            n.x = n.px = warp.x + Math.cos(a) * d; n.y = n.py = warp.y + Math.sin(a) * d; n.ix = n.iy = 0;
          }
        } else {
          const k = Math.exp(-2.4 * dt); n.ix *= k; n.iy *= k;
          if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
        }
      }
    }

    function draw(dt, wt) {
      ctx.clearRect(0, 0, w, h);
      const fade = warp ? Math.max(0, 1 - wt * 4) : 1;

      if (fade > 0) {
        ctx.lineWidth = 1; ctx.strokeStyle = "#ffffff";
        for (let i = 0; i < nodes.length; i++) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j++) {
            const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
            if (d2 > LINK * LINK) continue;
            ctx.globalAlpha = (1 - Math.sqrt(d2) / LINK) * .2 * fade * Math.min(a.z, b.z);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (!warp && pulses.length < 10 && Math.random() < .0004) pulses.push({ a, b, t: 0, sp: .6 + Math.random() * .7 });
          }
        }
        if (pointer.on && !warp) {
          ctx.strokeStyle = "#8edcff";
          for (const n of nodes) {
            const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
            if (d > 170) continue;
            ctx.globalAlpha = (1 - d / 170) * .4;
            ctx.beginPath(); ctx.moveTo(pointer.x, pointer.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          }
        }
        ctx.fillStyle = "#bfeaff";
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i]; p.t += dt * p.sp;
          if (p.t >= 1 || Math.hypot(p.a.x - p.b.x, p.a.y - p.b.y) > LINK * 1.5) { pulses.splice(i, 1); continue; }
          const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t, env = Math.sin(p.t * Math.PI) * fade;
          ctx.globalAlpha = .16 * env; ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.2832); ctx.fill();
          ctx.globalAlpha = .9 * env;  ctx.beginPath(); ctx.arc(x, y, 1.7, 0, 6.2832); ctx.fill();
        }
      }

      if (warp) {
        const tail = 1 + wt * 6;
        ctx.strokeStyle = "#d8f1ff"; ctx.lineCap = "round";
        for (const n of nodes) {
          ctx.globalAlpha = Math.min(1, .3 + wt * 2) * n.z; ctx.lineWidth = n.r;
          ctx.beginPath(); ctx.moveTo(n.x - (n.x - n.px) * tail, n.y - (n.y - n.py) * tail); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
      } else {
        ctx.fillStyle = "#ffffff";
        for (const n of nodes) { ctx.globalAlpha = .25 + .55 * n.z; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill(); }
      }

      for (const r of ripples) {
        const a = 1 - r.r / r.max;
        ctx.strokeStyle = r.color;
        ctx.globalAlpha = a * .08; ctx.lineWidth = 9;   ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 6.2832); ctx.stroke();
        ctx.globalAlpha = a * .55; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 6.2832); ctx.stroke();
      }
      if (hole) {   // 光圈边缘的亮环，画在遮罩洞口的外沿
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = .12; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(hole.x, hole.y, hole.r + 11, 0, 6.2832); ctx.stroke();
        ctx.globalAlpha = .75; ctx.lineWidth = 2;  ctx.beginPath(); ctx.arc(hole.x, hole.y, hole.r + 3, 0, 6.2832); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      if (!running) return;
      requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000 || 0, .05); last = now;
      const wt = warp ? (now - warp.t0) / 1000 : 0;
      update(dt, wt); draw(dt, wt);
    }

    function onMove(event) {
      if (event.pointerType && event.pointerType !== "mouse") return;
      pointer.x = event.clientX; pointer.y = event.clientY; pointer.on = true;
    }
    function onLeave() { pointer.on = false; }

    resize();
    window.addEventListener("resize", resize);
    gate.addEventListener("pointermove", onMove);
    gate.addEventListener("pointerleave", onLeave);
    requestAnimationFrame(frame);

    return {
      ripple(x, y, kind) { const k = KINDS[kind]; ripples.push({ x, y, r: 0, max: k.max(), speed: k.speed, force: k.force, color: k.color }); },
      warp(x, y) {
        warp = { x, y, t0: performance.now() };
        // 平时的节点数对星流来说太稀，跃迁开始时在全屏补一批
        for (let i = 0; i < 170; i++) nodes.push(makeNode());
      },
      hole(x, y, r) { hole = { x, y, r }; },
      stop() {
        running = false;
        window.removeEventListener("resize", resize);
        gate.removeEventListener("pointermove", onMove);
        gate.removeEventListener("pointerleave", onLeave);
      }
    };
  }

  // 卡片跟随鼠标做轻微 3D 倾斜，并在卡面上打一束跟随的光。只对鼠标生效。
  function setupTilt(gate) {
    if (REDUCED || !window.matchMedia || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const tilt = gate.querySelector(".access-gate__tilt");
    gate.addEventListener("pointermove", event => {
      if (gate.classList.contains("is-open")) return;
      const box = tilt.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (event.clientX - box.left - box.width / 2) / (window.innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (event.clientY - box.top - box.height / 2) / (window.innerHeight / 2)));
      tilt.style.transform = "rotateX(" + (-ny * 4).toFixed(2) + "deg) rotateY(" + (nx * 5).toFixed(2) + "deg)";
      tilt.style.setProperty("--ag-gx", (event.clientX - box.left).toFixed(0) + "px");
      tilt.style.setProperty("--ag-gy", (event.clientY - box.top).toFixed(0) + "px");
      gate.classList.add("is-hover");
    });
    gate.addEventListener("pointerleave", () => { tilt.style.transform = ""; gate.classList.remove("is-hover"); });
  }

  function hide(gate) {
    gate.hidden = true;
    document.documentElement.classList.remove("access-gate-pending");
  }

  // 圆形光圈从卡片中心扩开，直接在门上挖洞露出下面已经渲染好的页面
  function iris(gate, fx, cx, cy) {
    const max = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy)) + 60;
    const t0 = performance.now();
    (function step(now) {
      const p = Math.max(0, Math.min((now - t0) / IRIS_MS, 1));
      const r = (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2) * max;
      const mask = "radial-gradient(circle at " + cx + "px " + cy + "px, transparent " + r + "px, #000 " + (r + 2) + "px)";
      gate.style.webkitMaskImage = mask; gate.style.maskImage = mask;
      fx.hole(cx, cy, r);
      if (p < 1 && !gate.hidden) requestAnimationFrame(step);
    })(t0);
  }

  // 输对密码后的转场：开锁 → 冲击波 → 跃迁 → 光圈揭幕。
  // 已验证过的会话直接走 hide()，不播动画。
  function unlock(gate, fx) {
    remember();
    gate.classList.add("is-open");
    document.getElementById("accessGateState").textContent = "已验证";
    document.querySelector("#accessGateSubmit span").textContent = "验证通过";
    if (REDUCED) { hide(gate); return; }
    const box = gate.querySelector(".access-gate__frame").getBoundingClientRect();
    const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
    gate.querySelector(".access-gate__tilt").style.transform = "";
    fx.ripple(cx, cy, "open");
    setTimeout(() => { gate.classList.add("is-warp"); fx.warp(cx, cy); }, WARP_AT);
    setTimeout(() => iris(gate, fx, cx, cy), IRIS_AT);
    // 收尾放在定时器里而不是动画帧回调里：后台标签页不触发 rAF，门会卡着不消失
    setTimeout(() => { fx.stop(); hide(gate); }, IRIS_AT + IRIS_MS + 80);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const gate = buildGate();
    if (verified()) { hide(gate); return; }
    document.documentElement.classList.remove("access-gate-pending");
    const fx = startFx(gate);
    setupTilt(gate);
    const form = document.getElementById("accessGateForm");
    const input = document.getElementById("accessGatePassword");
    const error = document.getElementById("accessGateError");
    const toggle = document.getElementById("accessGateToggle");
    const caps = document.getElementById("accessGateCaps");
    input.focus();

    function fail(message) {
      error.textContent = message;
      gate.classList.remove("is-error");
      void gate.offsetWidth;                 // 重排一次，连续输错时抖动动画才会重播
      gate.classList.add("is-error");
      input.focus();
    }

    toggle.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      toggle.setAttribute("aria-pressed", String(show));
      toggle.setAttribute("aria-label", show ? "隐藏密码" : "显示密码");
      input.focus();
    });
    input.addEventListener("input", () => {
      // 每敲一个字符，从光标大致所在的位置向背景网络发一圈涟漪
      const box = input.getBoundingClientRect();
      fx.ripple(box.left + Math.min(16 + input.value.length * 9, box.width - 52), box.top + box.height / 2, "key");
      if (!gate.classList.contains("is-error")) return;
      gate.classList.remove("is-error");
      error.textContent = "";
    });
    ["keydown", "keyup"].forEach(type => input.addEventListener(type, event => {
      if (event.getModifierState) caps.hidden = !event.getModifierState("CapsLock");
    }));
    input.addEventListener("blur", () => { caps.hidden = true; });

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (gate.classList.contains("is-open")) return;
      if (!input.value) { fail("请输入访问密码"); return; }
      const enteredHash = await sha256(input.value);
      if (enteredHash === EXPECTED_HASH) { error.textContent = ""; gate.classList.remove("is-error"); unlock(gate, fx); }
      else {
        const box = input.getBoundingClientRect();
        input.value = ""; fail("密码错误，请重新输入");
        fx.ripple(box.left + box.width / 2, box.top + box.height / 2, "error");
      }
    });
  });
})();
