/* Dawwar site: the wheel you can try, and the small motions around it.
   No text lives here: every word comes from the page (the #dw-data block, written by _src/build.mjs). */
(() => {
  "use strict";
  const doc = document, root = doc.documentElement;
  const $ = (s, r = doc) => r.querySelector(s);
  const $$ = (s, r = doc) => [...r.querySelectorAll(s)];
  const D = JSON.parse($("#dw-data").textContent);
  const S = D.s;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const NS = "http://www.w3.org/2000/svg";
  const CATS = ["convert", "tools", "actions"];
  const KEY_CAT = { Shift: "convert", Control: "tools", Alt: "actions" };

  /* ---------------------------------------------------------------- page-wide */
  // Things rise into place the first time they are seen.
  const seen = new IntersectionObserver((list) => {
    for (const e of list) if (e.isIntersecting) { e.target.classList.add("is-in"); seen.unobserve(e.target); }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
  $$("[data-reveal]").forEach((n) => seen.observe(n));

  // The logo turns as the page scrolls: it is a wheel, after all.
  let queued = false;
  addEventListener("scroll", () => {
    if (queued || still) return;
    queued = true;
    requestAnimationFrame(() => { root.style.setProperty("--spin", (scrollY * 0.2).toFixed(1) + "deg"); queued = false; });
  }, { passive: true });

  // The key in use colours the whole page.
  function setCat(cat) {
    root.dataset.cat = cat;
    $$(".keycap").forEach((k) => k.classList.toggle("is-on", k.dataset.cat === cat));
    $$(".keycard").forEach((k) => k.classList.toggle("is-on", k.dataset.cat === cat));
  }
  const capDown = (cat, on) => $$(`.keycap[data-cat="${cat}"]`).forEach((k) => k.classList.toggle("is-down", on));
  const capsUp = () => $$(".keycap.is-down").forEach((k) => k.classList.remove("is-down"));

  /* ---------------------------------------------------------------- drawings */
  const ICON = {
    compress: "M20 4l-6 6m0-4.5V10h4.5M4 20l6-6m-4.5 0H10v4.5",
    resize: "M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7",
    crop: "M7 3v14h14M3 7h14v14",
    text: "M3.5 19 9 6l5.5 13M5.6 14.5h6.8M15 19l3-7.5 3 7.5M16.2 16.2h3.6",
    qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5zM20 14v1M14 19.5v.5",
    rotate: "M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5",
    edit: "M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19zM14.5 6.5l3 3",
    lock: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3M12 15v1.5",
    zip: "M4 5h16v4H4zM5.5 9v10h13V9M10 13h4",
    search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16 16l4.5 4.5",
    image: "M4 5h16v14H4zM4 16l4.5-4.5 4 4 3-3L20 17M8.5 8.5v.5",
    page: "M7 3h7l4 4v14H7zM14 3v4h4",
    wrench: "M20 7a4.5 4.5 0 0 1-6.2 4.2L6 19l-2-2 7.8-7.8A4.5 4.5 0 0 1 17 4l-2.5 2.5 1 2 2 1z",
    target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    scissors: "M6 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6 14a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM8 9l12 9M8 15 20 6",
    split: "M12 3v18M4 7h5v10H4zM15 7h5v10h-5z",
    speed: "M4 17a8 8 0 1 1 16 0M12 17l4-6",
    sound: "M4 10v4h3l5 4V6l-5 4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11",
    bell: "M6 17v-6a6 6 0 0 1 12 0v6l1.5 2h-15zM10 21.5h4",
    tag: "M4 4h8l8 8-8 8-8-8zM8.5 8.5v.5",
    sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16v4M17 18h4",
    share: "M14 4l6 6-6 6M20 10H10a6 6 0 0 0-6 6v3",
    pin: "M9 4h6l-1 6 3 3H7l3-3zM12 13v7",
    copy: "M9 9h11v11H9zM5 15H4V4h11v1",
    move: "M3 6h6l2 2h10v11H3zM10 13.5h6M13.5 11l2.5 2.5-2.5 2.5",
    info: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v6M12 7.5v.5",
    link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L12 6.3M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
    terminal: "M3 5h18v14H3zM7 10l3 2.5L7 15M12 15h5",
    clipboard: "M8 5H5v16h14V5h-3M9 3h6v4H9z",
    list: "M4 6h2M4 12h2M4 18h2M9 6h11M9 12h11M9 18h6",
  };
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  // File pictures, drawn here so the page needs no picture files for them.
  function fileIcon(kind, ext) {
    const page = (band, label) =>
      `<path d="M14 4h25l13 13v43H14z" fill="#f1f1f4"/><path d="M39 4v13h13z" fill="#c9cad2"/>` +
      `<rect x="7" y="34" width="38" height="17" rx="3.5" fill="${band}"/>` +
      `<text x="26" y="46.6" text-anchor="middle" font-family="Segoe UI,system-ui,sans-serif" font-size="${label.length > 3 ? 9.5 : 11}" font-weight="700" fill="#fff">${label}</text>`;
    let body;
    if (kind === "image")
      body = `<rect x="4" y="11" width="56" height="42" fill="#1f5567"/><rect x="4" y="11" width="56" height="20" fill="#17404f"/><circle cx="44" cy="30" r="5" fill="#f6d08b"/>` +
        `<path d="M4 42c8-6 15-7 22-3s14 2 20-2 10-3 14 0v16H4z" fill="#8c5140"/><path d="M4 48c10-5 18-3 27 0s18 2 29-3v8H4z" fill="#5c2f2b"/>`;
    else if (kind === "video")
      body = `<rect x="4" y="12" width="56" height="40" rx="5" fill="#101116"/><rect x="13" y="16" width="38" height="32" rx="2" fill="#3a2f6e"/><path d="M27 25v14l12-7z" fill="#fff"/>` +
        [18, 26, 34, 42].map((y) => `<rect x="6.5" y="${y}" width="4" height="4" rx="1" fill="#f1f1f4"/><rect x="53.5" y="${y}" width="4" height="4" rx="1" fill="#f1f1f4"/>`).join("");
    else if (kind === "pdf") body = page("#e5484d", "PDF");
    else if (kind === "audio") body = page("#8b5cf6", "MP3") + `<path d="M21 26v-4M26 28v-9M31 26v-5M36 27v-3" stroke="#8b5cf6" stroke-width="2.4" stroke-linecap="round"/>`;
    else body = page("var(--accent)", String(ext).toUpperCase()).replace('fill="#fff">', 'fill="#07131c">');
    return `<svg viewBox="0 0 64 64" aria-hidden="true">${body}</svg>`;
  }

  /* ---------------------------------------------------------------- the wheel */
  const stage = $("#stage");
  if (!stage) return;
  const filesEl = $("#files"), wheel = $("#wheel"), svg = $("svg", wheel), ghost = $("#ghost"),
    cursor = $("#cursor"), toasts = $("#toasts"), hint = $("#hint"), keysEl = $(".stage__keys");
  const files = D.demo.files;
  const RO = 300, RI = 121, GAP = 11, RL = 213;

  const mk = (name, attrs, parent) => {
    const n = doc.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  // A slice: a piece of the ring between two angles (0 is up, clockwise), with an even gap to its neighbours.
  function sector(a0, a1) {
    const go = Math.asin(GAP / 2 / RO), gi = Math.asin(GAP / 2 / RI);
    const p = (r, a) => `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`;
    const big = a1 - a0 - 2 * go > Math.PI ? 1 : 0;
    return `M${p(RO, a0 + go)}A${RO} ${RO} 0 ${big} 1 ${p(RO, a1 - go)}L${p(RI, a1 - gi)}A${RI} ${RI} 0 ${big} 0 ${p(RI, a0 + gi)}Z`;
  }
  // A long label goes on two lines, split at the space nearest its middle.
  function lines(label) {
    if (label.length < 13 || !label.includes(" ")) return [label];
    let best = -1;
    for (let i = label.indexOf(" "); i >= 0; i = label.indexOf(" ", i + 1))
      if (best < 0 || Math.abs(i - label.length / 2) < Math.abs(best - label.length / 2)) best = i;
    return [label.slice(0, best), label.slice(best + 1)];
  }

  svg.innerHTML = '<defs><radialGradient id="dw-hub" cx=".5" cy=".35" r=".6"><stop offset="0" stop-color="#2a2b33"/><stop offset="1" stop-color="#131419"/></radialGradient></defs>';
  mk("circle", { class: "w-plate", r: 314 }, svg);
  mk("circle", { class: "w-rim", r: 312 }, svg);
  const gSlices = mk("g", {}, svg);
  const hub = mk("g", { class: "w-hub" }, svg);
  mk("circle", { class: "w-plate", r: RI - 5 }, hub);
  mk("circle", { class: "hub-bg", r: 101 }, hub);
  const hubTitle = mk("text", { class: "hub-title", y: -20, "text-anchor": "middle" }, hub);
  const hubName = mk("text", { class: "hub-name", y: 10, "text-anchor": "middle", direction: root.dir }, hub);
  {
    const widths = { convert: 48, tools: 40, actions: 36 };
    let x = -(48 + 40 + 36 + 10) / 2;
    for (const c of CATS) {
      const g = mk("g", { class: "chip", "data-cat": c, role: "button", tabindex: "0", "aria-label": `${D.demo.cats[c].key}: ${D.demo.cats[c].label}` }, hub);
      mk("rect", { x, y: 27, width: widths[c], height: 22, rx: 7 }, g);
      mk("text", { x: x + widths[c] / 2, y: 38.5, "text-anchor": "middle", "dominant-baseline": "central" }, g).textContent = D.demo.cats[c].key;
      x += widths[c] + 5;
    }
  }

  const W = { open: false, file: files[0], cat: "convert", items: [], hot: -1, x: 0, y: 0, d: 440 };
  let sel = files[0];

  function itemsFor(file, cat) {
    if (cat === "convert") return D.demo.convert[file.kind].map((l) => ({ l, ext: l.toLowerCase() }));
    return cat === "tools" ? D.demo.tools[file.kind] : D.demo.actions;
  }
  function draw() {
    const list = (W.items = itemsFor(W.file, W.cat));
    W.hot = -1;
    gSlices.textContent = "";
    const step = (2 * Math.PI) / list.length;
    list.forEach((it, i) => {
      const a = i * step, x = RL * Math.sin(a), y = -RL * Math.cos(a);
      const g = mk("g", { class: "slice", "data-i": i, role: "button", tabindex: "0", "aria-label": it.l, style: `--i:${i}` }, gSlices);
      mk("path", { class: "seg", d: sector(a - step / 2, a + step / 2) }, g);
      if (!it.i) {
        mk("text", { class: "fmt", x: x.toFixed(1), y: y.toFixed(1), "text-anchor": "middle", "dominant-baseline": "central" }, g).textContent = it.l;
        return;
      }
      const two = lines(it.l), top = y - (two.length > 1 ? 27 : 17);
      mk("path", { d: ICON[it.i] || "" }, mk("g", { class: "ico", transform: `translate(${(x - 15).toFixed(1)} ${(top - 15).toFixed(1)}) scale(1.25)` }, g));
      two.forEach((line, n) => {
        mk("text", { x: x.toFixed(1), y: (top + 33 + n * 25).toFixed(1), "text-anchor": "middle", "dominant-baseline": "central" }, g).textContent = line;
      });
    });
    hubTitle.textContent = D.demo.cats[W.cat].label;
    const name = `${W.file.base}.${W.file.ext}`;
    hubName.textContent = name;
    hubName.style.fontSize = name.length > 22 ? "13px" : "";
    $$(".chip", hub).forEach((c) => c.classList.toggle("is-on", c.dataset.cat === W.cat));
  }

  /* ---------------------------------------------------------------- the stage */
  const fileBtn = (f) => $(`.file[data-id="${f.id}"]`, filesEl);
  const byId = (id) => files.find((f) => f.id === id);
  const box = () => stage.getBoundingClientRect();
  const say = (text) => { hint.textContent = text; };
  const step = (n) => $$("#steps li").forEach((li) => li.classList.toggle("is-on", +li.dataset.step === n));

  for (const f of files) {
    const b = doc.createElement("button");
    b.type = "button"; b.className = "file"; b.dataset.id = f.id;
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = fileIcon(f.kind, f.ext) + "<span></span>";
    b.lastChild.textContent = f.base;
    b.setAttribute("aria-label", `${f.base}.${f.ext}`);
    filesEl.appendChild(b);
  }
  function select(f) {
    sel = f;
    $$(".file", filesEl).forEach((b) => { const on = b.dataset.id === f.id; b.classList.toggle("is-sel", on); b.setAttribute("aria-pressed", on); });
  }

  // Where the wheel sits when nobody is pointing: the middle of the room under the files.
  function home() {
    const r = box(), top = filesEl.getBoundingClientRect().bottom - r.top + 8;
    const bottom = r.width < 520 ? keysEl.getBoundingClientRect().top - r.top - 10 : r.height - 12;
    const d = Math.max(230, Math.min(440, r.width - 20, bottom - top));
    return { x: r.width / 2, y: top + (bottom - top) / 2, d };
  }
  function place(x, y) {
    const r = box(), d = home().d, m = d / 2 + 6;
    W.d = d;
    W.x = Math.min(Math.max(x, m), Math.max(m, r.width - m));
    W.y = Math.min(Math.max(y, m), Math.max(m, r.height - m));
    wheel.style.setProperty("--d", d + "px");
    wheel.style.setProperty("--x", W.x + "px");
    wheel.style.setProperty("--y", W.y + "px");
    wheel.classList.toggle("wheel--sm", d < 370);
  }
  function openWheel(cat, x, y) {
    W.open = true; W.cat = cat;
    setCat(cat); draw(); place(x, y);
    wheel.classList.add("is-open");
    step(2);
  }
  function switchCat(cat) {
    if (cat === W.cat) return;
    W.cat = cat; setCat(cat); draw();
  }
  function closeWheel() {
    W.open = false; W.hot = -1;
    wheel.classList.remove("is-open");
  }
  function setHot(i) {
    if (i === W.hot) return;
    W.hot = i;
    [...gSlices.children].forEach((s, n) => s.classList.toggle("is-hot", n === i));
  }
  function slicePoint(i) {
    const a = (i * 2 * Math.PI) / W.items.length, k = (W.d / 640) * RL;
    return { x: W.x + k * Math.sin(a), y: W.y - k * Math.cos(a) };
  }

  let autoGhost = false;
  function ghostOn(f) {
    ghost.innerHTML = fileIcon(f.kind, f.ext) + "<span dir='auto'></span>";
    ghost.lastChild.textContent = `${f.base}.${f.ext}`;
    ghost.classList.add("is-on");
  }
  function ghostAt(x, y) { ghost.style.setProperty("--x", x + 16 + "px"); ghost.style.setProperty("--y", y + 14 + "px"); }
  function ghostOff() { autoGhost = false; ghost.classList.remove("is-on"); $$(".is-lifted", filesEl).forEach((b) => b.classList.remove("is-lifted")); }

  // The drop: the slice lights up, the wheel closes, and the card in the corner reports.
  let toastN = 0, toastT = 0;
  function run(i) {
    const it = W.items[i];
    if (!it) return;
    const file = W.file, cat = W.cat;
    gSlices.children[i].classList.add("is-drop");
    step(3); ghostOff();
    if (!auto) say(idleHint());
    setTimeout(() => { closeWheel(); card(file, cat, it); }, still ? 0 : 230);
  }
  function card(file, cat, it) {
    clearTimeout(toastT);
    toasts.textContent = "";
    $$(".file--new", filesEl).forEach((n) => n.remove());
    const conv = cat === "convert", my = ++toastN;
    const t = doc.createElement("div");
    t.className = "toast";
    t.innerHTML = fileIcon(conv ? "new" : file.kind, conv ? it.l : file.ext) +
      `<div><b dir="auto"></b><small></small><div class="toast__bar"><i></i></div></div><span class="toast__ok">${CHECK}</span>`;
    $("b", t).textContent = conv ? `${file.base}.${it.ext}` : `${file.base}.${file.ext}`;
    const note = $("small", t);
    note.textContent = conv ? S.converting : `${it.l} · ${S.working}`;
    toasts.appendChild(t);
    setTimeout(() => {
      if (my !== toastN) return;
      t.classList.add("is-done");
      note.textContent = conv ? S.saved : `${it.l} · ${S.done}`;
      if (conv) {  // the new file appears next to the original, as it does in the folder
        const n = doc.createElement("div");
        n.className = "file file--new"; n.title = S.newFile;
        n.innerHTML = fileIcon("new", it.l) + "<span></span>";
        n.lastChild.textContent = file.base;
        fileBtn(file).after(n);
      }
    }, still ? 0 : 1150);
    toastT = setTimeout(() => {
      if (my !== toastN) return;
      t.classList.add("is-out"); step(0);
      setTimeout(() => t.remove(), 320);
    }, 4300);
  }

  /* ---------------------------------------------------------------- by hand */
  let drag = null, lastPointer = "mouse", justDragged = false, lastUser = -1e9, idleT = 0;
  let play = 0, auto = false, inView = false;

  // The visitor takes over: the show stops where it is, and comes back after a quiet while.
  function takeover() {
    lastUser = performance.now();
    if (auto) {
      play++; auto = false;
      stage.classList.remove("is-auto");
      cursor.classList.remove("is-on", "is-down");
      ghostOff(); capsUp();
      toasts.setAttribute("aria-live", "polite");
      say(W.open ? S.hintPick : idleHint());
    }
    clearTimeout(idleT);
    idleT = setTimeout(() => { if (inView && !drag && !still) autoplay(); }, 16000);
  }
  const idleHint = () => (lastPointer === "touch" ? S.hintTouch : S.hintIdle);

  filesEl.addEventListener("pointerdown", (e) => {
    const b = e.target.closest(".file:not(.file--new)");
    lastPointer = e.pointerType || "mouse";
    if (!b || e.button) return;
    takeover();
    if (W.open) closeWheel();
    select(byId(b.dataset.id));
    say(idleHint());
    if (lastPointer !== "touch") drag = { file: sel, btn: b, x0: e.clientX, y0: e.clientY, on: false, x: 0, y: 0 };
  });
  addEventListener("pointermove", (e) => {
    if (!drag) return;
    const r = box();
    drag.x = e.clientX - r.left; drag.y = e.clientY - r.top;
    if (!drag.on) {
      if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 6) return;
      drag.on = true;
      ghostOn(drag.file); drag.btn.classList.add("is-lifted"); stage.classList.add("is-dragging");
      step(1); say(S.hintDrag);
    }
    ghostAt(drag.x, drag.y);
    if (W.open) {
      const s = doc.elementFromPoint(e.clientX, e.clientY);
      const slice = s && s.closest && s.closest(".slice");
      setHot(slice ? +slice.dataset.i : -1);
    }
  });
  function endDrag(drop) {
    if (!drag) return;
    const d = drag;
    drag = null;
    stage.classList.remove("is-dragging");
    if (!d.on) return;
    justDragged = true; setTimeout(() => { justDragged = false; }, 0);
    if (drop && W.open && W.hot >= 0) return run(W.hot);
    ghostOff(); closeWheel(); step(0); say(idleHint());
  }
  addEventListener("pointerup", () => endDrag(true));
  addEventListener("pointercancel", () => endDrag(false));

  // A touch, or Enter on a file: there is no key to press, so the wheel opens by itself.
  filesEl.addEventListener("click", (e) => {
    const b = e.target.closest(".file:not(.file--new)");
    if (!b || justDragged) return;
    if (lastPointer === "touch" || e.detail === 0) { W.file = sel; const h = home(); openWheel("convert", h.x, h.y); say(S.hintPick); }
  });

  svg.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip"), slice = e.target.closest(".slice");
    takeover();
    if (chip) switchCat(chip.dataset.cat);
    else if (slice) run(+slice.dataset.i);
  });
  svg.addEventListener("pointermove", (e) => {
    if (drag || auto) return;
    const slice = e.target.closest(".slice");
    setHot(slice ? +slice.dataset.i : -1);
  });
  svg.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const t = e.target.closest(".chip, .slice");
    if (t) { e.preventDefault(); e.stopPropagation(); t.dispatchEvent(new MouseEvent("click", { bubbles: true })); }
  });
  stage.addEventListener("click", (e) => {
    if (W.open && !auto && !e.target.closest(".slice, .w-hub, .keycap, .file")) { closeWheel(); step(0); say(idleHint()); }
  });
  stage.addEventListener("pointerdown", (e) => { lastPointer = e.pointerType || "mouse"; takeover(); });

  $$(".keycap").forEach((k) => k.addEventListener("click", () => {
    const cat = k.dataset.cat;
    setCat(cat);
    if (!k.closest(".stage")) return;
    takeover();
    if (W.open) switchCat(cat);
    else { W.file = sel; const h = home(); openWheel(cat, h.x, h.y); }
    say(S.hintPick);
  }));

  // The real keys. During a drag they open the wheel under the pointer; tapped alone they open it for the
  // selected file. A key pressed together with anything else (Ctrl+C, Shift+Tab…) is left alone.
  let tap = null;
  const typing = () => { const a = doc.activeElement; return !!a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable); };
  addEventListener("keydown", (e) => {
    const cat = KEY_CAT[e.key];
    if (cat) {
      capDown(cat, true);
      if (e.key === "Alt") e.preventDefault();  // or the browser's menu takes the keyboard
      if (e.repeat) return;
      if (drag && drag.on) {
        e.preventDefault(); tap = null;
        if (W.open) switchCat(cat); else { W.file = drag.file; openWheel(cat, drag.x, drag.y); }
        say(S.hintWheel);
        return;
      }
      const others = (e.shiftKey && e.key !== "Shift") || (e.ctrlKey && e.key !== "Control") || (e.altKey && e.key !== "Alt") || e.metaKey;
      tap = others ? null : e.key;
      return;
    }
    tap = null;
    if (!W.open || drag || auto || !inView || typing()) return;
    const n = W.items.length;
    if (e.key === "Escape") { closeWheel(); step(0); say(idleHint()); }
    else if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setHot((W.hot + 1) % n); }
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setHot((W.hot + n - 1) % n); }
    else if (e.key === "Enter" && W.hot >= 0 && !(e.target.closest && e.target.closest("a, button"))) { e.preventDefault(); run(W.hot); }
  });
  addEventListener("keyup", (e) => {
    const cat = KEY_CAT[e.key];
    if (!cat) return;
    capDown(cat, false);
    if (e.key === "Alt") e.preventDefault();
    if (tap !== e.key || drag) return;
    tap = null;
    setCat(cat);
    if (!inView || typing()) return;
    takeover();
    if (W.open) switchCat(cat);
    else { W.file = sel; const h = home(); openWheel(cat, h.x, h.y); }
    say(S.hintPick);
  });
  addEventListener("pointerdown", () => { tap = null; });
  addEventListener("blur", () => { tap = null; capsUp(); });
  addEventListener("resize", () => { if (W.open && !drag) { const h = home(); place(h.x, h.y); } });

  /* ---------------------------------------------------------------- by itself */
  const at = { x: 0, y: 0 };
  function cursorAt(x, y) {
    at.x = x; at.y = y;
    cursor.style.setProperty("--x", x - 6 + "px");
    cursor.style.setProperty("--y", y - 4 + "px");
    if (autoGhost) ghostAt(x, y);
  }
  function glide(x, y, ms, ok) {
    return new Promise((done) => {
      const x0 = at.x, y0 = at.y, t0 = performance.now(), lift = Math.min(26, Math.hypot(x - x0, y - y0) * 0.12);
      (function frame(now) {
        if (!ok()) return done(false);
        const k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        cursorAt(x0 + (x - x0) * e, y0 + (y - y0) * e - Math.sin(k * Math.PI) * lift);
        if (k < 1) requestAnimationFrame(frame); else done(true);
      })(t0);
    });
  }
  const SHOW = [
    { file: "image", keys: ["convert"], pick: 0 },
    { file: "pdf", keys: ["tools"], pick: 1 },
    { file: "video", keys: ["convert", "actions"], pick: 5 },
    { file: "audio", keys: ["convert"], pick: 1 },
  ];
  async function autoplay() {
    const my = ++play, ok = () => my === play;
    auto = true;
    stage.classList.add("is-auto");
    toasts.setAttribute("aria-live", "off");
    closeWheel(); ghostOff(); step(0); say(S.hintAuto);
    const r = box();
    cursorAt(r.width * 0.5, r.height * 0.78);
    cursor.classList.add("is-on");
    for (let n = 0; ok(); n++) {
      const sc = SHOW[n % SHOW.length], f = byId(sc.file), b = fileBtn(f);
      await sleep(n ? 700 : 500); if (!ok()) return;
      const br = b.getBoundingClientRect(), s0 = box();
      if (!(await glide(br.left - s0.left + br.width / 2 + 4, br.top - s0.top + 34, 850, ok))) return;
      select(f); cursor.classList.add("is-down"); step(1);
      await sleep(300); if (!ok()) return;
      autoGhost = true; ghostOn(f); ghostAt(at.x, at.y); b.classList.add("is-lifted");
      const h = home();
      if (!(await glide(h.x, h.y, 900, ok))) return;
      for (let k = 0; k < sc.keys.length; k++) {
        const cat = sc.keys[k];
        capDown(cat, true);
        if (k === 0) { W.file = f; openWheel(cat, h.x, h.y); } else switchCat(cat);
        await sleep(280); capDown(cat, false); if (!ok()) return;
        await sleep(k < sc.keys.length - 1 ? 950 : 560); if (!ok()) return;
      }
      const p = slicePoint(sc.pick);
      if (!(await glide(p.x, p.y, 620, ok))) return;
      setHot(sc.pick);
      await sleep(480); if (!ok()) return;
      cursor.classList.remove("is-down");
      run(sc.pick);
      await sleep(3400);
    }
  }

  select(sel);
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    if (still) return;
    if (inView) { if (!auto && performance.now() - lastUser > 16000) autoplay(); }
    else if (auto) { play++; auto = false; cursor.classList.remove("is-on", "is-down"); ghostOff(); capsUp(); closeWheel(); }
  }, { threshold: 0.3 }).observe(stage);
  if (still) { const h = home(); openWheel("convert", h.x, h.y); say(S.hintPick); }

  /* ---------------------------------------------------------------- the dial of formats */
  const orbit = $("#orbit");
  if (orbit) {
    const c = doc.createElement("div");
    c.className = "orbit__c";
    D.rings.forEach((list, n) => {
      const ring = doc.createElement("div");
      ring.className = `ring ring--${n + 1}`;
      list.forEach((name, i) => {
        const s = doc.createElement("span");
        s.textContent = name;
        s.style.setProperty("--a", ((360 / list.length) * i).toFixed(2) + "deg");
        ring.appendChild(s);
      });
      c.appendChild(ring);
    });
    orbit.prepend(c);
    new IntersectionObserver(([e]) => orbit.classList.toggle("is-live", e.isIntersecting && !still)).observe(orbit);
  }

  /* ---------------------------------------------------------------- Arabic, before and after */
  const SALAM = "السلام عليكم";
  const letters = [...SALAM];
  const BROKEN = {
    encoding: "ÇáÓáÇã Úáíßã",                                   // Windows-1256 bytes read as Latin
    reversed: letters.slice().reverse().join(""),               // a PDF that stores the line backwards
    joined: SALAM.split(" ").map((w) => [...w].join("‌")).join(" "),  // letters that do not join
  };
  const mend = {
    async encoding(p) {
      const pool = "ÇáÓãÚíßÞÐÝæÊÈ";
      for (let n = 0; n < 9; n++) {
        p.textContent = [...BROKEN.encoding].map((ch) => (ch === " " ? " " : pool[(Math.random() * pool.length) | 0])).join("");
        await sleep(55);
      }
      p.classList.remove("is-raw"); p.dir = "rtl";
      p.textContent = SALAM;
    },
    async reversed(p) {
      const a = letters.slice().reverse();
      for (let i = 0; i < a.length >> 1; i++) {
        [a[i], a[a.length - 1 - i]] = [a[a.length - 1 - i], a[i]];
        p.textContent = a.join("");
        await sleep(90);
      }
    },
    async joined(p) {
      let s = BROKEN.joined;
      while (s.includes("‌")) { s = s.replace("‌", ""); p.textContent = s; await sleep(75); }
    },
  };
  $$("[data-morph]").forEach((screen) => {
    const kind = screen.dataset.morph, p = $(".arcard__text", screen), state = $(".arcard__state", screen);
    const broken = () => {
      screen.classList.remove("is-fixed"); state.textContent = D.morph.before;
      p.textContent = BROKEN[kind];
      if (kind === "encoding") { p.classList.add("is-raw"); p.dir = "ltr"; }
    };
    const fixed = () => { screen.classList.add("is-fixed"); state.textContent = D.morph.after; };
    if (still) { p.textContent = SALAM; fixed(); return; }
    broken();
    let started = false;
    new IntersectionObserver(async ([e], io) => {
      if (!e.isIntersecting || started) return;
      started = true; io.disconnect();
      await sleep(900 + 350 * $$("[data-morph]").indexOf(screen));
      for (;;) {
        await mend[kind](p); fixed();
        await sleep(3200);
        broken();
        await sleep(1700);
      }
    }, { threshold: 0.5 }).observe(screen);
  });
})();
