// -------------------------------- bu gi_gate.js sonuna ekleniyor---------------------
const SECAM = {
  armed: false,
  armDelay: 1000,

  detectConsole: true,
  detectResize: false,
  detectDebugger: true,

  detectContextMenu: true,  // sağ tık engellensin (ama kill yok)
  detectKeys: true,

  killOnDetect: true
};

function onDetect(reason) {
  if (!SECAM.armed) return;

  console.warn("SECAMURITY HIT:", reason);

  if (!SECAM.killOnDetect) return;

  try {
    document.body.innerHTML = "";
    document.body.style.display = "none";
  } catch(e){}
}


/* -----------------------------------
  1) ARM
----------------------------------- */

setTimeout(() => {
  SECAM.armed = true;
  console.log("SECAMURITY ARMED (timer)");
}, SECAM.armDelay);

["click","mousemove","keydown","touchstart"].forEach(ev => {
  window.addEventListener(ev, () => {
    if (!SECAM.armed) {
      SECAM.armed = true;
      console.log("SECAMURITY ARMED (user)");
    }
  }, { once:true });
});


/* -----------------------------------
  2) Console detection
----------------------------------- */
if (SECAM.detectConsole) {
  const img = new Image();
  Object.defineProperty(img, "id", {
    get() { onDetect("ConsoleOpen"); }
  });
  console.log(img);
}


/* -----------------------------------
  3) Debugger freeze
----------------------------------- */
if (SECAM.detectDebugger) {
  setInterval(() => {
    const t = performance.now();
    debugger;
    if (performance.now() - t > 250) {
      onDetect("Debugger");
    }
  }, 2000);
}


/* -----------------------------------
  4) Sağ Tık Engelleme
  (sadece engeller, kill tetiklemez!)
----------------------------------- */
if (SECAM.detectContextMenu) {
  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();  // sadece menüyü engelle
    // onDetect KALDIRILDI!
  });
}


/* -----------------------------------
  5) F12 / Ctrl+U / Ctrl+Shift+I
----------------------------------- */
if (SECAM.detectKeys) {
  window.addEventListener("keydown", (e) => {

    if (e.key === "F12") {
      e.preventDefault();
      onDetect("F12");
    }

    if (
      e.ctrlKey && e.shiftKey &&
      ["I","J","C"].includes(e.key.toUpperCase())
    ) {
      e.preventDefault();
      onDetect("Ctrl+Shift+Combo");
    }

    if (e.ctrlKey && e.key.toUpperCase() === "U") {
      e.preventDefault();
      onDetect("Ctrl+U");
    }

  });
}