/* Client-side visual gate only; page source and assets remain public. */
(() => {
  "use strict";
  const EXPECTED_HASH = "53d8ab0c908b84d1203dbdffb1fc44748517dc67280e8f85b2cf8bd157134bdd";
  const SESSION_KEY = "adg331_apps_access_v1";

  async function sha256(text) {
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
  }

  function buildGate() {
    const gate = document.createElement("div");
    gate.className = "access-gate";
    gate.id = "accessGate";
    gate.innerHTML = `
      <form class="access-gate__box" id="accessGateForm" autocomplete="on">
        <div class="access-gate__mark" aria-hidden="true"></div>
        <h1>访问验证</h1>
        <p>请输入访问密码后进入演示站点</p>
        <input id="accessGatePassword" type="password" placeholder="访问密码" autocomplete="current-password" required aria-label="访问密码">
        <button type="submit">进入演示</button>
        <div class="access-gate__error" id="accessGateError" role="alert" aria-live="polite"></div>
        <span class="access-gate__contact">密码索取请联系<br><a href="mailto:enyang.fu@lenovonetapp.com">enyang.fu@lenovonetapp.com</a></span>
      </form>`;
    document.body.prepend(gate);
    return gate;
  }

  function unlock(gate) {
    sessionStorage.setItem(SESSION_KEY, "1");
    gate.hidden = true;
    document.documentElement.classList.remove("access-gate-pending");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const gate = buildGate();
    if (sessionStorage.getItem(SESSION_KEY) === "1") { unlock(gate); return; }
    document.documentElement.classList.remove("access-gate-pending");
    const form = document.getElementById("accessGateForm");
    const input = document.getElementById("accessGatePassword");
    const error = document.getElementById("accessGateError");
    input.focus();
    form.addEventListener("submit", async event => {
      event.preventDefault();
      const enteredHash = await sha256(input.value);
      if (enteredHash === EXPECTED_HASH) { error.textContent = ""; unlock(gate); }
      else { error.textContent = "密码错误，请重新输入"; input.value = ""; input.focus(); }
    });
  });
})();
