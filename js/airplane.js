/**
 * Rocket — Full-Page Free-Flight Animation
 * Starts idle, ignites, launches UPWARD, then flies across the entire page.
 */
(function () {
  const canvas = document.getElementById('airplane-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ─── Config ─────────────────────────────────────────
  const SPEED = 0.00012;
  const TRAIL_EMIT_INTERVAL = 35;
  const DOT_LIFETIME = 2200;
  const TRAIL_DOT_RADIUS = 3;
  const ROCKET_SIZE = 22;
  const ROCKET_COLOR = '#ffffff';
  const STROKE_WIDTH = 1.8;
  const MARGIN_X = 80;
  const MARGIN_Y = 80;

  // ─── Launch Sequence ────────────────────────────────
  const IDLE_DURATION = 1500;       // ms — rocket sits still, no flame
  const IGNITION_DURATION = 1000;   // ms — flame grows, still stationary
  const LAUNCH_DURATION = 2000;     // ms — rocket flies straight UP
  const TRANSITION_DURATION = 2500; // ms — smooth curve into flight path

  // Start position (viewport-relative)
  const START_X_RATIO = 0.241;
  const START_Y_RATIO = 0.40;
  const LAUNCH_DISTANCE = 50;     // px upward during launch
  // ────────────────────────────────────────────────────

  let dpr = window.devicePixelRatio || 1;
  let trail = [];
  let animId = null;
  let lastEmitTime = 0;
  let pageW = 0;
  let pageH = 0;
  let startTime = 0;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    pageW = document.documentElement.scrollWidth;
    pageH = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight
    );
    canvas.style.height = pageH + 'px';
    canvas.width = pageW * dpr;
    canvas.height = pageH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeInQuad(t) {
    return t * t;
  }

  /** Lissajous flight path across the full page */
  function getFlightPosition(t) {
    const freqX1 = 1.0, freqX2 = 2.3;
    const freqY1 = 0.4, freqY2 = 0.17;
    const ampX = (pageW - MARGIN_X * 2) / 2;
    const ampY = (pageH - MARGIN_Y * 2) / 2;
    const cx = pageW / 2;
    const cy = pageH / 2;

    const x = cx + ampX * (0.7 * Math.sin(t * freqX1) + 0.3 * Math.sin(t * freqX2 + 0.8));
    const y = cy + ampY * (0.7 * Math.cos(t * freqY1 + Math.PI) + 0.3 * Math.cos(t * freqY2 + Math.PI + 1.2));

    const dx = ampX * (0.7 * freqX1 * Math.cos(t * freqX1) + 0.3 * freqX2 * Math.cos(t * freqX2 + 0.8));
    const dy = ampY * (-0.7 * freqY1 * Math.sin(t * freqY1 + Math.PI) - 0.3 * freqY2 * Math.sin(t * freqY2 + Math.PI + 1.2));
    const angle = Math.atan2(dy, dx);

    return { x, y, angle };
  }

  /**
   * Phases: IDLE → IGNITION → LAUNCH (up) → TRANSITION → FLIGHT
   */
  function getRocketState(elapsed) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const startX = vw * START_X_RATIO;
    const startY = vh * START_Y_RATIO;
    const upAngle = -Math.PI / 2; // nose pointing UP

    const ignitionEnd = IDLE_DURATION + IGNITION_DURATION;
    const launchEnd = ignitionEnd + LAUNCH_DURATION;
    const transitionEnd = launchEnd + TRANSITION_DURATION;

    // Phase 1: IDLE
    if (elapsed < IDLE_DURATION) {
      return { x: startX, y: startY, angle: upAngle, flameIntensity: 0 };
    }

    // Phase 2: IGNITION — flame grows, rocket stays put
    if (elapsed < ignitionEnd) {
      const p = (elapsed - IDLE_DURATION) / IGNITION_DURATION;
      return { x: startX, y: startY, angle: upAngle, flameIntensity: easeInOutCubic(p) };
    }

    // Phase 3: LAUNCH — fly straight UP
    if (elapsed < launchEnd) {
      const p = (elapsed - ignitionEnd) / LAUNCH_DURATION;
      const dist = LAUNCH_DISTANCE * easeInQuad(p);
      return { x: startX, y: startY - dist, angle: upAngle, flameIntensity: 1 };
    }

    // Position after launch completes
    const launchEndX = startX;
    const launchEndY = startY - LAUNCH_DISTANCE;

    // Phase 4: TRANSITION — smooth Bezier ARC from launch-end to flight path
    if (elapsed < transitionEnd) {
      const p = (elapsed - launchEnd) / TRANSITION_DURATION;
      const eased = easeInOutCubic(p);

      const flightT = (elapsed - launchEnd) * SPEED;
      const flight = getFlightPosition(flightT);

      // Quadratic Bezier: P0 → P1 (control) → P2
      // P0 = launch end position
      const p0x = launchEndX;
      const p0y = launchEndY;
      // P1 = control point — goes HIGH above launch to create upward arc
      const p1x = launchEndX;
      const p1y = launchEndY - window.innerHeight * 0.4;
      // P2 = flight path destination
      const p2x = flight.x;
      const p2y = flight.y;

      // Bezier formula: B(t) = (1-t)²·P0 + 2·(1-t)·t·P1 + t²·P2
      const inv = 1 - eased;
      const bx = inv * inv * p0x + 2 * inv * eased * p1x + eased * eased * p2x;
      const by = inv * inv * p0y + 2 * inv * eased * p1y + eased * eased * p2y;

      // Bezier tangent for angle: B'(t) = 2·(1-t)·(P1-P0) + 2·t·(P2-P1)
      const tdx = 2 * inv * (p1x - p0x) + 2 * eased * (p2x - p1x);
      const tdy = 2 * inv * (p1y - p0y) + 2 * eased * (p2y - p1y);
      const bezierAngle = Math.atan2(tdy, tdx);

      return {
        x: bx,
        y: by,
        angle: bezierAngle,
        flameIntensity: 1
      };
    }

    // Phase 5: FLIGHT — normal
    const flightT = (elapsed - launchEnd) * SPEED;
    const flight = getFlightPosition(flightT);
    return { x: flight.x, y: flight.y, angle: flight.angle, flameIntensity: 1 };
  }

  /** Draw the rocket */
  function drawRocket(x, y, angle, timestamp, flameIntensity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);

    const s = ROCKET_SIZE;

    // ── Exhaust flame ──
    if (flameIntensity > 0) {
      const fi = flameIntensity;
      const flicker = Math.sin(timestamp * 0.02) * 0.15 + 1;
      const flicker2 = Math.cos(timestamp * 0.035) * 0.1 + 1;

      // Outer flame
      ctx.shadowColor = `rgba(255, 120, 20, ${0.8 * fi})`;
      ctx.shadowBlur = 15 * fi;
      ctx.fillStyle = `rgba(255, 140, 40, ${0.7 * fi})`;
      ctx.beginPath();
      ctx.moveTo(-s * 0.2 * fi, s * 0.55);
      ctx.quadraticCurveTo(-s * 0.08, s * (0.55 + (0.35 + 0.2 * flicker) * fi), 0, s * (0.55 + (0.55 + 0.25 * flicker) * fi));
      ctx.quadraticCurveTo(s * 0.08, s * (0.55 + (0.35 + 0.2 * flicker2) * fi), s * 0.2 * fi, s * 0.55);
      ctx.closePath();
      ctx.fill();

      // Inner flame
      ctx.shadowBlur = 8 * fi;
      ctx.shadowColor = `rgba(255, 200, 60, ${0.9 * fi})`;
      ctx.fillStyle = `rgba(255, 230, 100, ${0.85 * fi})`;
      ctx.beginPath();
      ctx.moveTo(-s * 0.1 * fi, s * 0.55);
      ctx.quadraticCurveTo(-s * 0.03, s * (0.55 + (0.2 + 0.15 * flicker2) * fi), 0, s * (0.55 + (0.3 + 0.15 * flicker) * fi));
      ctx.quadraticCurveTo(s * 0.03, s * (0.55 + (0.2 + 0.15 * flicker) * fi), s * 0.1 * fi, s * 0.55);
      ctx.closePath();
      ctx.fill();
    }

    // ── Body ──
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeStyle = ROCKET_COLOR;
    ctx.lineWidth = STROKE_WIDTH;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(s * 0.35, -s * 0.5, s * 0.25, s * 0.2);
    ctx.lineTo(s * 0.25, s * 0.55);
    ctx.lineTo(-s * 0.25, s * 0.55);
    ctx.lineTo(-s * 0.25, s * 0.2);
    ctx.quadraticCurveTo(-s * 0.35, -s * 0.5, 0, -s);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Nose accent
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = STROKE_WIDTH * 0.6;
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, -s * 0.3);
    ctx.quadraticCurveTo(0, -s * 0.85, s * 0.15, -s * 0.3);
    ctx.stroke();

    // Porthole
    ctx.fillStyle = 'rgba(100, 200, 255, 0.5)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = STROKE_WIDTH * 0.5;
    ctx.beginPath();
    ctx.arc(0, -s * 0.05, s * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right fin
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeStyle = ROCKET_COLOR;
    ctx.lineWidth = STROKE_WIDTH * 0.8;
    ctx.beginPath();
    ctx.moveTo(s * 0.25, s * 0.3);
    ctx.lineTo(s * 0.55, s * 0.65);
    ctx.lineTo(s * 0.25, s * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Left fin
    ctx.beginPath();
    ctx.moveTo(-s * 0.25, s * 0.3);
    ctx.lineTo(-s * 0.55, s * 0.65);
    ctx.lineTo(-s * 0.25, s * 0.55);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  /** Fading dotted trail */
  function drawTrail(now) {
    if (trail.length === 0) return;

    while (trail.length > 0 && (now - trail[0].born) > DOT_LIFETIME) {
      trail.shift();
    }

    for (let i = 0; i < trail.length; i++) {
      const dot = trail[i];
      const age = now - dot.born;
      const life = 1 - (age / DOT_LIFETIME);
      if (life <= 0) continue;

      const easedLife = life * life;
      const pulse = 1 + Math.sin(age * 0.008) * 0.2;
      const alpha = easedLife * 0.7;
      const radius = TRAIL_DOT_RADIUS * easedLife * pulse;

      const r = 255;
      const g = Math.round(180 + 75 * (1 - life));
      const b = Math.round(60 + 195 * (1 - life));

      ctx.save();
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

      if (life > 0.6) {
        ctx.shadowColor = `rgba(255, 160, 40, ${easedLife * 0.4})`;
        ctx.shadowBlur = 6 * easedLife;
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, Math.max(0.3, radius), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /** Main animation loop */
  function animate(timestamp) {
    if (!timestamp) timestamp = 0;
    if (!startTime) startTime = timestamp;

    const elapsed = timestamp - startTime;

    ctx.clearRect(0, 0, pageW, pageH);

    const state = getRocketState(elapsed);

    // Emit trail only when engine is on
    if (state.flameIntensity > 0.3 && (timestamp - lastEmitTime > TRAIL_EMIT_INTERVAL)) {
      trail.push({ x: state.x, y: state.y, born: timestamp });
      lastEmitTime = timestamp;
    }

    drawTrail(timestamp);
    drawRocket(state.x, state.y, state.angle, timestamp, state.flameIntensity);

    animId = requestAnimationFrame(animate);
  }

  // ─── Init ──────────────────────────────────────────
  function init() {
    resize();
    if (!animId) animId = requestAnimationFrame(animate);
  }

  requestAnimationFrame(init);
  window.addEventListener('resize', resize);
  const ro = new ResizeObserver(() => resize());
  ro.observe(document.body);
})();
