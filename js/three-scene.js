/**
 * ZEPARTURE — HERO 3D SCENE
 * ---------------------------------------------------------
 * A wireframe globe with glowing flight-path arcs, each with a
 * small low-poly paper-airplane flying along it (nose oriented
 * to the direction of travel) and a short fading contrail.
 * Built to be light enough for mobile: capped pixel ratio, low
 * poly counts, single render target.
 * ---------------------------------------------------------
 */
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("hero-canvas");
if (canvas) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const wrap = canvas.parentElement;
  const COLORS = {
    primary: 0x9a4af2,
    accent: 0xede0ff,
    dim: 0x2a2238,
  };

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    42,
    wrap.clientWidth / wrap.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 7.4);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);

  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // ---- Wireframe globe ----
  const globeGeo = new THREE.IcosahedronGeometry(2.35, 3);
  const globeMat = new THREE.MeshBasicMaterial({
    color: COLORS.dim,
    wireframe: true,
    transparent: true,
    opacity: 0.55,
  });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  globeGroup.add(globe);

  // ---- Inner glow core ----
  const coreGeo = new THREE.IcosahedronGeometry(2.32, 1);
  const coreMat = new THREE.MeshBasicMaterial({
    color: COLORS.primary,
    transparent: true,
    opacity: 0.06,
  });
  globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

  // ---- Starfield ----
  const starCount = 420;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const radius = 6 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = radius * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );
  const starMat = new THREE.PointsMaterial({
    color: COLORS.accent,
    size: 0.028,
    transparent: true,
    opacity: 0.55,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // ---- Flight-path arcs across the globe surface ----
  function randomSurfacePoint(radius) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
  }

  // Tiny low-poly paper-airplane: nose points along local -Z so it can be
  // aimed forward with .lookAt() as it travels along each arc.
  function createPlane() {
    const group = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.ConeGeometry(0.02, 0.1, 6),
      new THREE.MeshBasicMaterial({ color: COLORS.accent })
    );
    body.rotation.x = -Math.PI / 2;
    group.add(body);

    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(0.13, 0.004, 0.032),
      new THREE.MeshBasicMaterial({ color: COLORS.accent })
    );
    wing.position.z = 0.012;
    group.add(wing);

    const tailFin = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.022, 0.004),
      new THREE.MeshBasicMaterial({ color: COLORS.accent })
    );
    tailFin.position.z = 0.038;
    tailFin.position.y = 0.008;
    group.add(tailFin);

    return group;
  }

  const ARC_COUNT = 7;
  const arcs = [];
  const travelers = [];
  const TRAIL_LENGTH = 5;
  const TRAIL_GAP = 0.013;

  for (let i = 0; i < ARC_COUNT; i++) {
    const start = randomSurfacePoint(2.38);
    const end = randomSurfacePoint(2.38);
    const mid = start
      .clone()
      .add(end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2.38 + 1.1 + Math.random() * 0.6);

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(64);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: COLORS.primary,
      transparent: true,
      opacity: 0.32,
    });
    const line = new THREE.Line(geo, mat);
    globeGroup.add(line);
    arcs.push(curve);

    // the plane itself
    const plane = createPlane();
    globeGroup.add(plane);

    // a short fading contrail of small dots behind it
    const trailDots = [];
    for (let t = 0; t < TRAIL_LENGTH; t++) {
      const dotGeo = new THREE.SphereGeometry(0.016, 6, 6);
      const dotMat = new THREE.MeshBasicMaterial({
        color: COLORS.primary,
        transparent: true,
        opacity: 0.4 * (1 - t / TRAIL_LENGTH),
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      globeGroup.add(dot);
      trailDots.push(dot);
    }

    travelers.push({
      plane,
      trailDots,
      curve,
      t: Math.random(),
      speed: 0.07 + Math.random() * 0.045,
    });
  }

  globeGroup.rotation.x = 0.15;
  globeGroup.rotation.y = -0.4;

  // ---- Resize ----
  function onResize() {
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  // ---- Mouse parallax ----
  let targetX = 0;
  let targetY = 0;
  window.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  const clock = new THREE.Clock();
  const _tmpLookTarget = new THREE.Vector3();

  function renderFrame() {
    const delta = clock.getDelta();

    globeGroup.rotation.y += delta * 0.09;
    globeGroup.rotation.x += (targetY * 0.3 - globeGroup.rotation.x) * 0.02;
    globeGroup.rotation.z += (targetX * 0.15 - globeGroup.rotation.z) * 0.02;

    travelers.forEach((tr) => {
      tr.t += delta * tr.speed;
      if (tr.t > 1) tr.t = 0;

      const p = tr.curve.getPoint(tr.t);
      tr.plane.position.copy(p);

      // aim the nose along the direction of travel — lookAt needs a
      // WORLD-space target, but our curve points are in globeGroup's
      // local space (it's spinning), so convert before calling it.
      const tangent = tr.curve.getTangent(tr.t);
      _tmpLookTarget.set(p.x + tangent.x, p.y + tangent.y, p.z + tangent.z);
      globeGroup.localToWorld(_tmpLookTarget);
      tr.plane.lookAt(_tmpLookTarget);

      // fading contrail: each dot sits a little further back along the curve
      tr.trailDots.forEach((dot, i) => {
        const trailT = ((tr.t - (i + 1) * TRAIL_GAP) % 1 + 1) % 1;
        dot.position.copy(tr.curve.getPoint(trailT));
      });
    });

    renderer.render(scene, camera);
  }

  if (prefersReducedMotion) {
    renderFrame();
  } else {
    renderer.setAnimationLoop(renderFrame);
  }

  // Pause rendering when hero is off-screen (perf)
  const heroSection = document.getElementById("hero");
  if (heroSection && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (prefersReducedMotion) return;
          if (entry.isIntersecting) {
            renderer.setAnimationLoop(renderFrame);
          } else {
            renderer.setAnimationLoop(null);
          }
        });
      },
      { threshold: 0.05 }
    );
    io.observe(heroSection);
  }
}
