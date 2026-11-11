/**
 * Hero 3D scene: a lit, draggable phone and a milk bottle, rendered with three.js.
 *
 * Bundled separately by scripts/build-3d.mjs into /public/three/hero-scene.js
 * and loaded by a tiny inline loader in Hero.tsx only after the page has
 * painted and gone idle, so it never delays first paint or LCP. Until it's
 * ready (or if WebGL is unavailable) the CSS phone fallback stays visible.
 */
import {
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  type Texture,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

type Palette = { paper: string; surface: string; ink: string; ink2: string; accent: string; rule: string; dark: boolean };

function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string) => cs.getPropertyValue(name).trim();
  const paper = v("--paper");
  return {
    paper,
    surface: v("--surface"),
    ink: v("--ink"),
    ink2: v("--ink-2"),
    accent: v("--accent"),
    rule: v("--rule"),
    dark: new Color(paper).getHSL({ h: 0, s: 0, l: 0 }).l < 0.5,
  };
}

/* ------------------------------------------------------------------ */
/* Phone screen: drawn on a 2D canvas, so it follows the theme          */
/* ------------------------------------------------------------------ */

const SCREEN_W = 540;
const SCREEN_H = 1170;

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawSplash(ctx: CanvasRenderingContext2D, p: Palette, fonts: { display: string; mono: string; sans: string }) {
  const W = SCREEN_W;
  const H = SCREEN_H;
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  roundRect(ctx, 0, 0, W, H, 62);
  ctx.clip();
  ctx.fillStyle = p.surface;
  ctx.fillRect(0, 0, W, H);

  // status bar + notch
  ctx.fillStyle = p.ink;
  ctx.font = `400 26px ${fonts.mono}`;
  ctx.textBaseline = "middle";
  ctx.fillText("9:41", 44, 52);
  roundRect(ctx, W / 2 - 80, 28, 160, 46, 23);
  ctx.fill();

  // monogram
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.font = `500 230px ${fonts.display}`;
  const mono = "LK";
  const mw = ctx.measureText(mono).width;
  const mx = (W - mw - 40) / 2;
  ctx.fillText(mono, mx, 470);
  ctx.fillStyle = p.accent;
  ctx.beginPath();
  ctx.arc(mx + mw + 26, 452, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = p.ink;
  ctx.font = `500 46px ${fonts.display}`;
  ctx.fillText("Lakshya Katewa", W / 2, 570);
  ctx.fillStyle = p.ink2;
  ctx.font = `400 22px ${fonts.mono}`;
  ctx.fillText("FRONTEND DEVELOPER", W / 2, 620);

  // dotted receipt rule
  ctx.strokeStyle = p.ink2;
  ctx.setLineDash([3, 7]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 690);
  ctx.lineTo(W - 60, 690);
  ctx.stroke();
  ctx.setLineDash([]);

  // "now shipping" card
  ctx.fillStyle = p.ink;
  roundRect(ctx, 40, H - 300, W - 80, 190, 34);
  ctx.fill();
  ctx.textAlign = "left";
  ctx.fillStyle = p.paper;
  ctx.globalAlpha = 0.7;
  ctx.font = `400 20px ${fonts.mono}`;
  ctx.fillText("NOW SHIPPING", 80, H - 240);
  ctx.globalAlpha = 1;
  ctx.font = `500 42px ${fonts.display}`;
  ctx.fillText("ChinarAgro", 80, H - 185);
  ctx.font = `400 26px ${fonts.sans}`;
  ctx.fillText("Live on Google Play", 80, H - 145);

  // home indicator
  ctx.fillStyle = p.rule;
  roundRect(ctx, W / 2 - 70, H - 40, 140, 8, 4);
  ctx.fill();
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

export function mount(host: HTMLElement) {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const screenshot = host.dataset.screenshot;

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "stage-canvas";
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0.35, 7.4);
  camera.lookAt(0, 0.05, 0);

  // lights
  const hemi = new HemisphereLight(0xffffff, 0x8a8170, 1.6);
  scene.add(hemi);
  const key = new DirectionalLight(0xffffff, 2.2);
  key.position.set(1.4, 6.5, 3.2);
  scene.add(key);
  const rim = new DirectionalLight(0xffffff, 1.1);
  rim.position.set(-3, 1.5, -2.5);
  scene.add(rim);

  // contact shadow: a blurred ellipse baked into a tiny texture (no shadow map)
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 128;
  const sctx = shadowCanvas.getContext("2d")!;
  const grad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(0,0,0,1)");
  grad.addColorStop(0.35, "rgba(0,0,0,0.5)");
  grad.addColorStop(0.7, "rgba(0,0,0,0.12)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 128, 128);
  const shadowMat = new MeshBasicMaterial({ map: new CanvasTexture(shadowCanvas), transparent: true, depthWrite: false, opacity: 0.22 });
  const ground = new Mesh(new PlaneGeometry(2.5, 0.8), shadowMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0.2, -1.31, 0.15);
  scene.add(ground);

  const rig = new Group(); // everything that rotates
  scene.add(rig);

  /* phone */
  const phone = new Group();
  const bodyMat = new MeshStandardMaterial({ roughness: 0.32, metalness: 0.25 });
  const body = new Mesh(new RoundedBoxGeometry(1.08, 2.2, 0.11, 6, 0.14), bodyMat);
  phone.add(body);

  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = SCREEN_W;
  screenCanvas.height = SCREEN_H;
  const screenTex = new CanvasTexture(screenCanvas);
  screenTex.colorSpace = SRGBColorSpace;
  screenTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const screenMat = new MeshBasicMaterial({ map: screenTex, transparent: true, toneMapped: false });
  const screen = new Mesh(new PlaneGeometry(0.98, 2.1), screenMat);
  screen.position.z = 0.0565;
  phone.add(screen);

  const buttonMat = bodyMat;
  for (const [y, h] of [
    [0.55, 0.22],
    [0.25, 0.22],
  ]) {
    const b = new Mesh(new RoundedBoxGeometry(0.03, h, 0.05, 2, 0.012), buttonMat);
    b.position.set(-0.555, y, 0);
    phone.add(b);
  }
  const power = new Mesh(new RoundedBoxGeometry(0.03, 0.32, 0.05, 2, 0.012), buttonMat);
  power.position.set(0.555, 0.4, 0);
  phone.add(power);

  // camera bump on the back, so the phone reads as a phone from every angle
  const bumpMat = new MeshStandardMaterial({ color: 0x2a2823, roughness: 0.25, metalness: 0.4 });
  const bump = new Mesh(new RoundedBoxGeometry(0.42, 0.42, 0.04, 4, 0.09), bumpMat);
  bump.position.set(-0.24, 0.78, -0.07);
  phone.add(bump);
  const lensMat = new MeshStandardMaterial({ color: 0x0b0b0c, roughness: 0.05, metalness: 0.6 });
  for (const [x, y] of [
    [-0.33, 0.87],
    [-0.15, 0.69],
    [-0.33, 0.69],
  ]) {
    const lens = new Mesh(new CylinderGeometry(0.065, 0.065, 0.03, 32), lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, y, -0.1);
    phone.add(lens);
  }

  phone.position.set(-0.32, 0.02, 0);
  phone.rotation.set(0.05, -0.38, 0.05);
  rig.add(phone);

  /* milk bottle (lathe profile: radius, height) */
  const profile = [
    [0, 0],
    [0.27, 0],
    [0.3, 0.03],
    [0.31, 0.12],
    [0.31, 0.72],
    [0.29, 0.86],
    [0.2, 1.0],
    [0.15, 1.1],
    [0.15, 1.2],
    [0.17, 1.22],
    [0.17, 1.27],
    [0, 1.27],
  ].map(([x, y]) => new Vector2(x, y));
  const bottle = new Group();
  const milkMat = new MeshStandardMaterial({ color: 0xf7f4ee, roughness: 0.18 });
  const glass = new Mesh(new LatheGeometry(profile, 48), milkMat);
  bottle.add(glass);
  const capMat = new MeshStandardMaterial({ roughness: 0.45 });
  const cap = new Mesh(new CylinderGeometry(0.185, 0.185, 0.1, 40), capMat);
  cap.position.y = 1.29;
  bottle.add(cap);
  const bandMat = new MeshStandardMaterial({ roughness: 0.6 });
  const band = new Mesh(new CylinderGeometry(0.316, 0.316, 0.26, 48, 1, true), bandMat);
  band.position.y = 0.42;
  bottle.add(band);
  bottle.position.set(0.82, -1.32, 0.35);
  bottle.scale.setScalar(0.92);
  rig.add(bottle);

  /* theme + screen content */
  let shotTexture: Texture | null = null;
  function applyTheme() {
    const p = readPalette();
    bodyMat.color.set(p.dark ? "#34312b" : "#1c1a17");
    capMat.color.set(p.accent);
    bandMat.color.set(p.dark ? "#2a3a4c" : "#24548a");
    hemi.color.set(p.dark ? 0xcfd8e6 : 0xffffff);
    hemi.groundColor.set(p.dark ? 0x1a1916 : 0x8a8170);
    shadowMat.opacity = p.dark ? 0.6 : 0.3;
    if (!shotTexture) {
      const cs = getComputedStyle(document.documentElement);
      const fonts = {
        // set on <html> by next/font
        display: `${cs.getPropertyValue("--font-fraunces").trim() || "Georgia"}, Georgia, serif`,
        mono: `${cs.getPropertyValue("--font-jetbrains").trim() || "Menlo"}, Menlo, monospace`,
        sans: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      };
      drawSplash(screenCanvas.getContext("2d")!, p, fonts);
      screenTex.needsUpdate = true;
    }
    requestRender();
  }

  if (screenshot) {
    new TextureLoader().load(screenshot, (tex) => {
      tex.colorSpace = SRGBColorSpace;
      shotTexture = tex;
      screenMat.map = tex;
      screenMat.needsUpdate = true;
      requestRender();
    });
  }

  /* sizing */
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // keep both objects in frame on narrow stages
    camera.position.z = camera.aspect < 0.85 ? 7.2 : 6.3;
    camera.updateProjectionMatrix();
    requestRender();
  }
  new ResizeObserver(resize).observe(host);

  /* interaction: drag to rotate (horizontal), gentle cursor parallax */
  const rest = { x: 0.04, y: -0.18 };
  const target = { x: rest.x, y: rest.y };
  // entrance: start turned away and swing into the resting pose
  const current = { x: rest.x, y: reduceMotion ? rest.y : rest.y - 1.4 };
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velocity = 0;

  host.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    host.setPointerCapture(e.pointerId);
    host.dataset.dragging = "1";
    requestRender();
  });
  host.addEventListener("pointermove", (e) => {
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      velocity = dx * 0.012;
      target.y += velocity;
      target.x = Math.max(-0.35, Math.min(0.5, target.x + dy * 0.004));
    } else if (e.pointerType === "mouse" && !reduceMotion) {
      const r = host.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      target.y = rest.y + nx * 0.5;
      target.x = rest.x + ny * 0.25;
    }
    requestRender();
  });
  const release = () => {
    dragging = false;
    delete host.dataset.dragging;
    requestRender();
  };
  host.addEventListener("pointerup", release);
  host.addEventListener("pointercancel", release);
  host.addEventListener("pointerleave", () => {
    if (!dragging) {
      target.x = rest.x;
      target.y = rest.y;
      requestRender();
    }
  });

  /* render loop: only while visible; idles when settled under reduced motion */
  let visible = true;
  let ready = false;
  let raf = 0;
  const start = performance.now();
  function frame(now: number) {
    raf = 0;
    const t = (now - start) / 1000;

    if (!dragging) {
      // inertia, then ease back toward rest
      target.y += velocity;
      velocity *= 0.92;
      if (Math.abs(velocity) < 0.0005) {
        velocity = 0;
        target.y += (rest.y - target.y) * 0.02;
        target.x += (rest.x - target.x) * 0.02;
      }
    }
    current.x += (target.x - current.x) * 0.1;
    current.y += (target.y - current.y) * 0.1;

    rig.rotation.set(current.x, current.y, 0);
    // a small float while the scene is moving; it eases out as things settle
    const motion = Math.min(1, Math.abs(target.y - current.y) * 4 + Math.abs(velocity) * 20);
    phone.position.y = 0.02 + (reduceMotion ? 0 : Math.sin(t * 1.4) * 0.03 * motion);

    renderer.render(scene, camera);
    if (!host.dataset.ready) host.dataset.ready = "1";

    const settled = Math.abs(target.y - current.y) < 0.0005 && Math.abs(target.x - current.x) < 0.0005 && velocity === 0;
    // render on demand: the loop stops once the pose settles, so an idle hero costs nothing
    if (visible && !document.hidden && (dragging || !settled)) requestRender();
  }
  function requestRender() {
    if (ready && !raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    requestRender();
  }).observe(host);
  document.addEventListener("visibilitychange", requestRender);

  // react to the theme toggle and to OS theme changes
  new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);

  resize();
  applyTheme();
  // compile shaders without blocking the main thread where the browser supports it,
  // then start rendering; redraw the screen once web fonts are ready
  renderer
    .compileAsync(scene, camera)
    .catch(() => undefined)
    .then(() => {
      ready = true;
      requestRender();
    });
  document.fonts?.ready.then(applyTheme);
}
