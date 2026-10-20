import { BIG_FOUR_COMPONENTS } from '../data/engineeringComponents.js';

// 3x5 dot matrix font for shelf lip labels and technical displays
const FONT_3X5 = {
  A: "111101111101101",
  B: "110101110101110",
  C: "111100100100111",
  D: "110101101101110",
  E: "111100111100111",
  F: "111100110100100",
  G: "111100101101111",
  H: "101101111101101",
  I: "111010010010111",
  J: "001001001101010",
  K: "101110100110101",
  L: "100100100100111",
  M: "101111101101101",
  N: "101111111101101",
  O: "111101101101111",
  P: "111101111100100",
  Q: "111101101111001",
  R: "110101110101101",
  S: "111100111001111",
  T: "111010010010010",
  U: "101101101101111",
  V: "101101101101010",
  W: "101101101111101",
  X: "101101010101101",
  Y: "101101010010010",
  Z: "111001010100111",
  0: "111101101101111",
  1: "010110010010111",
  2: "111001111100111",
  3: "111001111001111",
  4: "101101111001001",
  5: "111100111001111",
  6: "111100111101111",
  7: "111001010010010",
  8: "111101111101111",
  9: "111101111001111",
  "[": "110100100100110",
  "]": "011001001001011",
  "-": "000000111000000",
  ".": "000000000000010",
  "/": "001001010100100",
  ":": "000010000010000",
  "+": "000010111010000",
  "=": "000111000111000",
  " ": "000000000000000"
};

export function buildEngineeringScene(width, height, seed, figureDef, context, FigureClass) {
  let rngState = seed || 42;
  const rand = () => {
    rngState |= 0;
    let t = Math.imul((rngState = rngState + 0x6d2b79f5 | 0) ^ rngState >>> 15, 1 | rngState);
    return (((t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t) ^ t >>> 14) >>> 0) / 0x100000000;
  };
  const randRange = (min, max) => min + (max - min) * rand();
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const lerp = (a, b, t) => a + (b - a) * t;

  const u = 0.5 * width;
  const f = 0.4 * height;
  const m = 0.85 * Math.max(width, height);

  const project = (x, y, z) => {
    const s = m / (m + z);
    return [u + (x - u) * s, f + (y - f) * s];
  };

  const lines = { shelf: [], grid: [], prod: [], back: [], detail: [] };
  const dots = [];
  const components = [];

  const addPolyline = (layer, pts, closed = false) => {
    const coords = [];
    for (const pt of pts) {
      const p = project(pt[0], pt[1], pt[2]);
      coords.push(p[0], p[1]);
    }
    if (closed && coords.length >= 4) {
      coords.push(coords[0], coords[1]);
    }
    lines[layer].push(coords);
  };

  const addLine = (layer, p1, p2) => {
    addPolyline(layer, [p1, p2], false);
  };

  const addDot = (x, y, z, size = 1.0, sparkle = false) => {
    const p = project(x, y, z);
    if (p[0] < -10 || p[0] > width + 10 || p[1] < -10 || p[1] > height + 10) return;
    dots.push({
      x: p[0],
      y: p[1],
      s: size,
      sp: sparkle,
      ph: 6.283 * rand(),
      fq: randRange(1.4, 3.6)
    });
  };

  const addBox = (x0, x1, y0, y1, z0, z1) => {
    const faces = {
      top: y0 > f,
      bottom: y1 < f,
      left: x0 > u,
      right: x1 < u,
      front: true,
      back: false
    };
    const xs = [x0, x1];
    const ys = [y0, y1];
    const zs = [z0, z1];
    const d = (i) => (i ? "bottom" : "top");
    const p = (i) => (i ? "right" : "left");
    const c = (i) => (i ? "back" : "front");

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        addLine(faces[d(i)] || faces[c(j)] ? "prod" : "back", [x0, ys[i], zs[j]], [x1, ys[i], zs[j]]);
        addLine(faces[p(i)] || faces[c(j)] ? "prod" : "back", [xs[i], y0, zs[j]], [xs[i], y1, zs[j]]);
        addLine(faces[p(i)] || faces[d(j)] ? "prod" : "back", [xs[i], ys[j], z0], [xs[i], ys[j], z1]);
      }
    }
    return faces;
  };

  const addRect = (layer, x1, x2, y1, y2, z) => {
    addPolyline(layer, [
      [x1, y1, z],
      [x2, y1, z],
      [x2, y2, z],
      [x1, y2, z]
    ], true);
  };

  const addCircle3D = (layer, cx, cy, cz, radius, numSegs = 24, plane = "XY") => {
    const pts = [];
    for (let i = 0; i <= numSegs; i++) {
      const ang = (i / numSegs) * Math.PI * 2;
      if (plane === "XY") {
        pts.push([cx + Math.cos(ang) * radius, cy + Math.sin(ang) * radius, cz]);
      } else if (plane === "XZ") {
        pts.push([cx + Math.cos(ang) * radius, cy, cz + Math.sin(ang) * radius]);
      } else {
        pts.push([cx, cy + Math.cos(ang) * radius, cz + Math.sin(ang) * radius]);
      }
    }
    addPolyline(layer, pts, true);
  };

  const addText3x5 = (text, startX, startY, z, dotSize = 0.8) => {
    let curX = startX;
    const charSpacing = dotSize * 4;
    for (const ch of text.toUpperCase()) {
      if (ch === " ") {
        curX += charSpacing * 0.75;
        continue;
      }
      const bitmap = FONT_3X5[ch] || FONT_3X5[" "];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 3; col++) {
          if (bitmap[row * 3 + col] === "1") {
            addDot(curX + col * dotSize, startY + row * dotSize, z, dotSize * 0.95, true);
          }
        }
      }
      curX += charSpacing;
    }
    return curX;
  };

  // Robot Figure Placement
  const figurePlace = figureDef && figureDef.place(width, height, context);

  // Responsive Shelves: 2 Shelves for wide screens (2x2 layout), 4 Shelves for mobile (1x4 layout)
  const isMobile = width < 768;
  const NUM_SHELVES = isMobile ? 4 : 2;
  const T = height / (NUM_SHELVES + 0.28);
  const k = clamp(0.075 * T, 8, 18);
  const I = 0.85 * T;
  const shelfY = (s) => T * (s + 0.94);
  const A = -(0.3 * width);
  const S = 1.3 * width;
  const L = m / (m + I);
  const O = u - u / L - 30;
  const P = u + (width - u) / L + 30;
  const B = f - f / L - 30;
  const F = f + (height - f) / L + 30;
  const gridStep = clamp(0.09 * T, 16, 28);

  // Background Grid Matrix Dots on Back Wall (z = I)
  for (let s = 0; s <= NUM_SHELVES; s++) {
    const y0 = s === 0 ? B : shelfY(s - 1) + k;
    const y1 = s === NUM_SHELVES ? F : shelfY(s);
    for (let y = y0 + 0.6 * gridStep; y < y1 - 4; y += gridStep) {
      for (let x = Math.ceil(O / gridStep) * gridStep; x < P; x += gridStep) {
        addDot(x, y, I, 1.15, rand() < 0.14);
      }
    }
  }

  // Vertical Shelf Support Pillars
  const zPillar = 2.7 * T;
  const pillarW = clamp(0.05 * T, 8, 14);
  for (let x = u - zPillar / 2 - Math.ceil((u - O) / zPillar) * zPillar; x < P; x += zPillar) {
    const zPos = I - 1;
    addLine("shelf", [x - pillarW / 2, B, zPos], [x - pillarW / 2, F, zPos]);
    addLine("shelf", [x + pillarW / 2, B, zPos], [x + pillarW / 2, F, zPos]);
    for (let y = B; y < F; y += 1.7 * pillarW) {
      addLine("detail", [x, y, zPos], [x, y + 0.7 * pillarW, zPos]);
    }
  }

  // Horizontal Shelf Beams & Grid Surfaces
  const beamGrid = clamp(0.22 * T, 36, 64);
  for (let s = 0; s < NUM_SHELVES; s++) {
    const y = shelfY(s);
    addLine("shelf", [A, y, 0], [S, y, 0]);
    addLine("shelf", [A, y + k, 0], [S, y + k, 0]);
    addLine("grid", [O, y, I], [P, y, I]);
    addLine("grid", [O, y + k, I], [P, y + k, I]);
    for (let x = Math.ceil(A / beamGrid) * beamGrid; x < S; x += beamGrid) {
      addLine("grid", [x, y, 0], [x, y, I]);
    }
  }

  // Helper to register interactive clickable/tappable components
  const registerComponent = (compData, bounds3D) => {
    const [minX, maxX, minY, maxY, minZ, maxZ] = bounds3D;
    const corners = [
      project(minX, minY, minZ),
      project(maxX, minY, minZ),
      project(minX, maxY, minZ),
      project(maxX, maxY, minZ),
      project(minX, minY, maxZ),
      project(maxX, minY, maxZ),
      project(minX, maxY, maxZ),
      project(maxX, maxY, maxZ)
    ];
    let screenMinX = Infinity, screenMaxX = -Infinity;
    let screenMinY = Infinity, screenMaxY = -Infinity;
    for (const [px, py] of corners) {
      if (px < screenMinX) screenMinX = px;
      if (px > screenMaxX) screenMaxX = px;
      if (py < screenMinY) screenMinY = py;
      if (py > screenMaxY) screenMaxY = py;
    }
    const compObj = {
      id: compData.id,
      name: compData.name,
      tag: compData.tag,
      shelf: compData.shelf,
      category: compData.category,
      data: compData,
      bounds3D,
      screenBounds: [screenMinX, screenMaxX, screenMinY, screenMaxY],
      center: [(screenMinX + screenMaxX) / 2, (screenMinY + screenMaxY) / 2]
    };
    components.push(compObj);
    return compObj;
  };

  const availHeight = (T - k) * 0.86;
  const cz = 0.12 * I;

  // The 4 Big Items Definition and Placement
  // 1: Coke Plant Steel
  // 2: Motorcycle
  // 3: Quantitative Alpha Research
  // 4: Neural Network
  const itemsLayout = isMobile
    ? [
        { comp: BIG_FOUR_COMPONENTS[3], s: 0, cx: width * 0.5 }, // Coke Plant Steel
        { comp: BIG_FOUR_COMPONENTS[2], s: 1, cx: width * 0.5 }, // Motorcycle
        { comp: BIG_FOUR_COMPONENTS[1], s: 2, cx: width * 0.5 }, // Quant Alpha
        { comp: BIG_FOUR_COMPONENTS[0], s: 3, cx: width * 0.5 }  // Neural Network
      ]
    : [
        { comp: BIG_FOUR_COMPONENTS[3], s: 0, cx: width * 0.26 }, // Coke Plant Steel (Top-Left)
        { comp: BIG_FOUR_COMPONENTS[2], s: 0, cx: width * 0.74 }, // Motorcycle (Top-Right)
        { comp: BIG_FOUR_COMPONENTS[1], s: 1, cx: width * 0.26 }, // Quant Alpha (Bottom-Left)
        { comp: BIG_FOUR_COMPONENTS[0], s: 1, cx: width * 0.74 }  // Neural Network (Bottom-Right)
      ];

  for (const item of itemsLayout) {
    const { comp, s, cx } = item;
    const cy = shelfY(s);
    const h = clamp(availHeight * 0.94, 180, 310);
    const w = clamp((isMobile ? width * 0.82 : width * 0.44), 260, 480);

    switch (comp.id) {
      // =========================================================================
      // 1) COKE PLANT STEEL (By-Product Coke Oven Battery & Integrated Steelmaking)
      // =========================================================================
      case "coke-plant-steel": {
        const batW = w * 0.92;
        const batH = h * 0.88;
        const batLeft = cx - batW * 0.48;
        const batMidRight = cx + batW * 0.18;
        const towerRight = cx + batW * 0.48;

        // Base foundation bench
        addBox(batLeft - 8, towerRight + 8, cy - 14, cy, cz - 26, cz + 26);

        // Carbonization Battery Block (Silica Refractory Slot Ovens)
        const batteryTopY = cy - batH * 0.68;
        addBox(batLeft, batMidRight, batteryTopY, cy - 14, cz - 22, cz + 22);

        // Vertical Buckstays (Heavy structural steel I-beams clamping the oven walls)
        const numBuckstays = 8;
        for (let i = 0; i <= numBuckstays; i++) {
          const bx = lerp(batLeft + 6, batMidRight - 6, i / numBuckstays);
          addLine("prod", [bx - 2, batteryTopY, cz + 22], [bx - 2, cy - 14, cz + 22]);
          addLine("prod", [bx + 2, batteryTopY, cz + 22], [bx + 2, cy - 14, cz + 22]);
          addLine("detail", [bx - 2, batteryTopY + 4, cz + 22], [bx + 2, batteryTopY + 4, cz + 22]);
          addLine("detail", [bx - 2, cy - 18, cz + 22], [bx + 2, cy - 18, cz + 22]);

          // Oven doors and latch pins between buckstays
          if (i < numBuckstays) {
            const nextBx = lerp(batLeft + 6, batMidRight - 6, (i + 1) / numBuckstays);
            const doorMidX = (bx + nextBx) / 2;
            addRect("detail", doorMidX - 6, doorMidX + 6, batteryTopY + 12, cy - 24, cz + 22);
            addLine("detail", [doorMidX - 4, (batteryTopY + cy) / 2, cz + 23], [doorMidX + 4, (batteryTopY + cy) / 2, cz + 23]);
          }
        }

        // Top Charging Deck Rails & Larry Car (Coal Charging Car)
        const railY = batteryTopY - 2;
        addLine("prod", [batLeft - 4, railY, cz - 12], [batMidRight + 4, railY, cz - 12]);
        addLine("prod", [batLeft - 4, railY, cz + 12], [batMidRight + 4, railY, cz + 12]);

        // Larry Car on top of battery
        const larryX = batLeft + batW * 0.28;
        const larryY = railY - 4;
        addBox(larryX - 38, larryX + 38, larryY - 28, larryY, cz - 16, cz + 16);
        // 3 Coal Hopper Bins (inverted tapering hoppers)
        for (const hx of [larryX - 24, larryX, larryX + 24]) {
          addBox(hx - 10, hx + 10, larryY - 52, larryY - 28, cz - 12, cz + 12);
          addLine("detail", [hx - 10, larryY - 28, cz], [hx - 5, larryY, cz]);
          addLine("detail", [hx + 10, larryY - 28, cz], [hx + 5, larryY, cz]);
        }
        // Larry Car Operator Cabin & Pantograph
        addBox(larryX + 26, larryX + 36, larryY - 46, larryY - 28, cz + 10, cz + 16);
        addLine("detail", [larryX, larryY - 52, cz], [larryX, larryY - 68, cz]);
        addLine("detail", [larryX - 12, larryY - 68, cz], [larryX + 12, larryY - 68, cz]);

        // Gas Collecting Main (Large horizontal gas recovery pipe)
        const gasMainY = batteryTopY - 14;
        const gasMainZ = cz - 26;
        addLine("prod", [batLeft, gasMainY, gasMainZ], [batMidRight, gasMainY, gasMainZ]);
        addLine("prod", [batLeft, gasMainY - 12, gasMainZ], [batMidRight, gasMainY - 12, gasMainZ]);
        // Gooseneck ascension pipes rising from battery into gas collecting main
        for (let i = 0; i < 6; i++) {
          const gx = lerp(batLeft + 14, batMidRight - 14, i / 5);
          addPolyline("detail", [
            [gx, batteryTopY, cz - 12],
            [gx, gasMainY - 20, cz - 16],
            [gx, gasMainY - 16, gasMainZ],
            [gx, gasMainY - 6, gasMainZ]
          ]);
        }

        // Quenching Tower & Hot Coke Quenching Car (Right section)
        const towerLeft = batMidRight + 14;
        const towerTopY = cy - batH * 0.96;
        addBox(towerLeft, towerRight, towerTopY, cy - 14, cz - 24, cz + 24);
        // Tower vertical flue frames
        addLine("detail", [(towerLeft + towerRight) / 2, towerTopY, cz + 24], [(towerLeft + towerRight) / 2, cy - 14, cz + 24]);
        addLine("detail", [(towerLeft + towerRight) / 2, towerTopY, cz - 24], [(towerLeft + towerRight) / 2, cy - 14, cz - 24]);

        // Billowing Steam Plume from Quenching Tower
        for (let ring = 0; ring < 4; ring++) {
          const sY = towerTopY - 10 - ring * 12;
          const sR = 14 + ring * 8;
          addCircle3D("detail", (towerLeft + towerRight) / 2, sY, cz, sR, 16, "XZ");
          addDot((towerLeft + towerRight) / 2 + (rand() - 0.5) * sR, sY, cz + (rand() - 0.5) * sR, 1.3, true);
        }

        // Slanted Coke Quenching Car at base of tower
        const qCarX = (towerLeft + towerRight) / 2;
        addBox(qCarX - 22, qCarX + 22, cy - 28, cy - 14, cz - 18, cz + 18);
        // Hot glowing coke bed dots inside car
        for (let d = 0; d < 12; d++) {
          addDot(qCarX - 16 + (d % 4) * 10, cy - 22, cz - 10 + Math.floor(d / 4) * 10, 1.4, true);
        }

        registerComponent(comp, [batLeft - 10, towerRight + 10, towerTopY - 45, cy, cz - 30, cz + 30]);
        break;
      }

      // =========================================================================
      // 2) A MOTORCYCLE (High-Performance Chassis, Powertrain & Kinematics)
      // =========================================================================
      case "motorcycle": {
        const motoW = w * 0.94;
        const motoH = h * 0.88;
        const wheelbase = motoW * 0.62;
        const wheelR = clamp(motoH * 0.28, 38, 54);
        const rimR = wheelR * 0.82;
        const discR = wheelR * 0.62;

        // Wheel Hub Axle Coordinates
        const fx = cx - wheelbase * 0.48; // Front wheel center X
        const fy = cy - wheelR;           // Front wheel center Y
        const rx = cx + wheelbase * 0.48; // Rear wheel center X
        const ry = cy - wheelR;           // Rear wheel center Y

        // --- FRONT WHEEL ASSEMBLY ---
        // Tire outer and inner rings
        addCircle3D("prod", fx, fy, cz - 4, wheelR, 28, "XY");
        addCircle3D("prod", fx, fy, cz + 4, wheelR, 28, "XY");
        addCircle3D("detail", fx, fy, cz, rimR, 24, "XY");
        // Front Brake Disc Rotor
        addCircle3D("detail", fx, fy, cz + 5, discR, 18, "XY");
        // 16 Wire Spokes
        for (let i = 0; i < 16; i++) {
          const ang = (i / 16) * Math.PI * 2;
          addLine("detail", [fx, fy, cz], [fx + Math.cos(ang) * rimR, fy + Math.sin(ang) * rimR, cz + (i % 2 ? 3 : -3)]);
        }

        // --- REAR WHEEL ASSEMBLY ---
        // Wider rear tire
        addCircle3D("prod", rx, ry, cz - 6, wheelR, 28, "XY");
        addCircle3D("prod", rx, ry, cz + 6, wheelR, 28, "XY");
        addCircle3D("detail", rx, ry, cz, rimR, 24, "XY");
        // Rear Sprocket
        addCircle3D("detail", rx, ry, cz - 7, discR * 0.85, 18, "XY");
        // 16 Rear Wire Spokes
        for (let i = 0; i < 16; i++) {
          const ang = (i / 16) * Math.PI * 2;
          addLine("detail", [rx, ry, cz], [rx + Math.cos(ang) * rimR, ry + Math.sin(ang) * rimR, cz + (i % 2 ? 4 : -4)]);
        }

        // --- FRONT SUSPENSION & COCKPIT ---
        const headstockX = cx - motoW * 0.16;
        const headstockY = cy - motoH * 0.72;
        // Twin Inverted Fork Tubes
        addLine("prod", [fx, fy, cz - 6], [headstockX - 4, headstockY + 12, cz - 5]);
        addLine("prod", [fx, fy, cz + 6], [headstockX - 4, headstockY + 12, cz + 5]);
        addLine("detail", [fx + 4, fy - 6, cz - 6], [headstockX, headstockY + 6, cz - 5]);
        addLine("detail", [fx + 4, fy - 6, cz + 6], [headstockX, headstockY + 6, cz + 5]);
        // Front Calipers
        addBox(fx + 6, fx + 16, fy - 14, fy + 4, cz + 4, cz + 8);
        // Front Mudguard / Fender
        const fendPts = [];
        for (let i = 0; i <= 10; i++) {
          const ang = (i / 10) * (Math.PI * 0.5) + Math.PI * 0.75;
          fendPts.push([fx + Math.cos(ang) * (wheelR + 4), fy + Math.sin(ang) * (wheelR + 4), cz]);
        }
        addPolyline("prod", fendPts);

        // Triple Clamp & Steering Headstock
        addBox(headstockX - 6, headstockX + 4, headstockY, headstockY + 18, cz - 6, cz + 6);
        // Round Headlight Nacelle
        addCircle3D("prod", headstockX - 12, headstockY + 10, cz, 12, 16, "YZ");
        // Handlebars, Levers & Mirrors
        addLine("prod", [headstockX - 2, headstockY - 4, cz - 18], [headstockX - 2, headstockY - 4, cz + 18]);
        addLine("detail", [headstockX - 2, headstockY - 4, cz - 16], [headstockX - 6, headstockY - 14, cz - 20]);
        addLine("detail", [headstockX - 2, headstockY - 4, cz + 16], [headstockX - 6, headstockY - 14, cz + 20]);

        // --- CHASSIS & TRELLIS FRAME ---
        const swingarmPivotX = cx + motoW * 0.08;
        const swingarmPivotY = cy - wheelR * 1.35;
        // Trellis Triangulated Steel Tubes
        addLine("prod", [headstockX, headstockY + 14, cz - 6], [cx - 10, cy - motoH * 0.58, cz - 8]);
        addLine("prod", [headstockX, headstockY + 14, cz + 6], [cx - 10, cy - motoH * 0.58, cz + 8]);
        addLine("prod", [cx - 10, cy - motoH * 0.58, cz - 8], [swingarmPivotX, swingarmPivotY, cz - 8]);
        addLine("prod", [cx - 10, cy - motoH * 0.58, cz + 8], [swingarmPivotX, swingarmPivotY, cz + 8]);
        addLine("detail", [headstockX, headstockY + 14, cz], [cx - 18, cy - wheelR * 1.1, cz]);
        addLine("detail", [cx - 18, cy - wheelR * 1.1, cz], [swingarmPivotX, swingarmPivotY, cz]);

        // --- REAR SWINGARM & DRIVE CHAIN ---
        addLine("prod", [swingarmPivotX, swingarmPivotY, cz - 7], [rx, ry, cz - 7]);
        addLine("prod", [swingarmPivotX, swingarmPivotY, cz + 7], [rx, ry, cz + 7]);
        // Monoshock coil spring
        const shockTopX = cx + 8;
        const shockTopY = cy - motoH * 0.62;
        addLine("prod", [shockTopX, shockTopY, cz], [swingarmPivotX + 16, swingarmPivotY + 4, cz]);
        for (let i = 0; i < 6; i++) {
          const sx = lerp(shockTopX, swingarmPivotX + 16, i / 5);
          const sy = lerp(shockTopY, swingarmPivotY + 4, i / 5);
          addLine("detail", [sx - 3, sy, cz - 3], [sx + 3, sy, cz + 3]);
        }

        // --- ENGINE & TRANSMISSION (Parallel-Twin DOHC) ---
        const engineX = cx - 12;
        const engineY = cy - wheelR * 0.95;
        // Crankcase block
        addBox(engineX - 22, engineX + 22, engineY - 18, engineY + 18, cz - 14, cz + 14);
        // Cylinder barrels with cooling fins
        const cylTopX = engineX - 8;
        const cylTopY = engineY - 42;
        addBox(cylTopX - 14, cylTopX + 14, cylTopY, engineY - 18, cz - 12, cz + 12);
        for (let f = 0; f < 5; f++) {
          const fyVal = cylTopY + 5 + f * 4;
          addLine("detail", [cylTopX - 16, fyVal, cz + 12], [cylTopX + 16, fyVal, cz + 12]);
          addLine("detail", [cylTopX - 16, fyVal, cz - 12], [cylTopX + 16, fyVal, cz - 12]);
        }

        // Swept Dual Exhaust Header & Upswept Muffler
        addPolyline("prod", [
          [cylTopX - 8, cylTopY + 14, cz + 10],
          [cylTopX - 18, engineY + 14, cz + 12],
          [cx, engineY + 22, cz + 14],
          [swingarmPivotX + 18, engineY + 18, cz + 15],
          [rx - 14, ry - 14, cz + 16],
          [rx + 16, ry - 28, cz + 16] // Megaphone muffler tip
        ]);
        // Muffler body
        addBox(rx - 16, rx + 14, ry - 26, ry - 14, cz + 13, cz + 19);

        // --- FUEL TANK, SEAT & TAIL COWL ---
        // Sculpted Fuel Tank
        addPolyline("prod", [
          [headstockX, headstockY + 6, cz],
          [headstockX + 18, headstockY - 14, cz],
          [cx + 6, headstockY - 10, cz],
          [cx + 18, headstockY + 6, cz],
          [cx - 4, headstockY + 14, cz],
          [headstockX, headstockY + 6, cz]
        ]);
        // Fuel Tank Cap
        addCircle3D("detail", headstockX + 18, headstockY - 14, cz, 4, 12, "XZ");

        // Rider Saddle & Passenger Pillion
        addPolyline("prod", [
          [cx + 18, headstockY + 6, cz],
          [cx + 42, headstockY + 10, cz], // Rider dip
          [cx + 68, headstockY + 4, cz],  // Passenger step
          [rx + 18, headstockY + 2, cz],  // Sharp tail tip
          [rx + 10, headstockY + 14, cz],
          [swingarmPivotX + 4, headstockY + 16, cz],
          [cx + 18, headstockY + 6, cz]
        ]);

        registerComponent(comp, [fx - wheelR - 6, rx + wheelR + 6, headstockY - 20, cy, cz - 24, cz + 24]);
        break;
      }

      // =========================================================================
      // 3) QUANTITATIVE ALPHA RESEARCH (Trading Terminal, Candlesticks & Alphas)
      // =========================================================================
      case "quant-alpha": {
        const monW = w * 0.94;
        const monH = h * 0.86;
        const scrY = cy - 16;
        const scrTopY = scrY - monH;

        // Big Widescreen Monitor Console Frame & Bezel
        addBox(cx - monW * 0.48, cx + monW * 0.48, scrTopY, scrY, cz - 6, cz + 6);
        // Articulated Monitor Stand & Heavy Desktop Base
        addLine("shelf", [cx - 4, scrY, cz], [cx - 6, cy, cz]);
        addLine("shelf", [cx + 4, scrY, cz], [cx + 6, cy, cz]);
        addBox(cx - 36, cx + 36, cy - 6, cy, cz - 18, cz + 18);

        // Chart Viewport Boundaries
        const chartLeft = cx - monW * 0.44;
        const chartRight = cx + monW * 0.44;
        const chartW = chartRight - chartLeft;
        const mainChartBottom = scrTopY + monH * 0.58;

        // Grid lines (Price levels and time axes)
        for (let l = 1; l <= 3; l++) {
          const py = scrTopY + (monH * 0.58) * (l / 4);
          addLine("grid", [chartLeft, py, cz + 6], [chartRight, py, cz + 6]);
        }

        // 16 OHLC Candlestick Bars
        const numCandles = 16;
        const candleData = [
          { o: 0.62, c: 0.52, h: 0.44, l: 0.68 },
          { o: 0.52, c: 0.44, h: 0.38, l: 0.56 },
          { o: 0.44, c: 0.54, h: 0.4, l: 0.6 },
          { o: 0.54, c: 0.46, h: 0.42, l: 0.58 },
          { o: 0.46, c: 0.38, h: 0.32, l: 0.52 },
          { o: 0.38, c: 0.48, h: 0.35, l: 0.54 },
          { o: 0.48, c: 0.34, h: 0.28, l: 0.5 },
          { o: 0.34, c: 0.26, h: 0.2, l: 0.38 },
          { o: 0.26, c: 0.32, h: 0.22, l: 0.38 },
          { o: 0.32, c: 0.22, h: 0.16, l: 0.36 },
          { o: 0.22, c: 0.18, h: 0.12, l: 0.28 },
          { o: 0.18, c: 0.28, h: 0.14, l: 0.32 },
          { o: 0.28, c: 0.16, h: 0.1, l: 0.34 },
          { o: 0.16, c: 0.12, h: 0.08, l: 0.22 },
          { o: 0.12, c: 0.2, h: 0.09, l: 0.26 },
          { o: 0.2, c: 0.08, h: 0.04, l: 0.24 }
        ];

        const cWidth = clamp(chartW / (numCandles * 2.2), 4, 10);
        const emaFastPts = [];
        const emaSlowPts = [];

        for (let i = 0; i < numCandles; i++) {
          const cd = candleData[i];
          const kx = lerp(chartLeft + 12, chartRight - 12, i / (numCandles - 1));
          const topY = scrTopY + (mainChartBottom - scrTopY) * Math.min(cd.o, cd.c);
          const botY = scrTopY + (mainChartBottom - scrTopY) * Math.max(cd.o, cd.c);
          const highY = scrTopY + (mainChartBottom - scrTopY) * cd.h;
          const lowY = scrTopY + (mainChartBottom - scrTopY) * cd.l;

          // Upper and Lower Wick
          addLine("detail", [kx, highY, cz + 6], [kx, lowY, cz + 6]);
          // Candlestick Body
          addRect(cd.c < cd.o ? "prod" : "detail", kx - cWidth / 2, kx + cWidth / 2, topY, botY, cz + 6);

          // Moving average data points
          emaFastPts.push([kx, (topY + botY) / 2 - 4, cz + 7]);
          emaSlowPts.push([kx, (topY + botY) / 2 + 6, cz + 7]);
        }

        // Dual Moving Average Trendlines (Fast EMA & Slow EMA crossing)
        addPolyline("prod", emaFastPts);
        addPolyline("detail", emaSlowPts);

        // Lower Sub-Window: Volume Histogram & MACD / Alpha Signal
        const volTopY = mainChartBottom + 10;
        const volBottomY = scrY - 12;
        addLine("detail", [chartLeft, volTopY, cz + 6], [chartRight, volTopY, cz + 6]);

        for (let i = 0; i < numCandles; i++) {
          const kx = lerp(chartLeft + 12, chartRight - 12, i / (numCandles - 1));
          const vH = clamp(((i * 7) % 24) + 6, 6, (volBottomY - volTopY) * 0.85);
          addRect("detail", kx - cWidth / 2, kx + cWidth / 2, volBottomY - vH, volBottomY, cz + 6);
        }

        // MACD Momentum Wave across Volume
        const macdPts = [];
        for (let i = 0; i <= 20; i++) {
          const mx = lerp(chartLeft + 10, chartRight - 10, i / 20);
          const my = volTopY + (volBottomY - volTopY) * 0.5 + Math.sin(i * 0.45) * 8;
          macdPts.push([mx, my, cz + 7]);
        }
        addPolyline("prod", macdPts);

        // Floating Alpha Research HUD Box: ALPHA +18.4% | SHARPE 2.38
        const hudW = 120;
        const hudH = 34;
        const hudX = cx + monW * 0.18;
        const hudY = scrTopY + 12;
        addRect("prod", hudX, hudX + hudW, hudY, hudY + hudH, cz + 8);
        addText3x5("ALPHA: +18.4%", hudX + 6, hudY + 6, cz + 8, 0.7);
        addText3x5("SHARPE: 2.38", hudX + 6, hudY + 20, cz + 8, 0.7);

        // Gaussian Normal Return Distribution curve on the left
        const gOriginX = chartLeft + 14;
        const gOriginY = scrTopY + 38;
        const bellPts = [];
        for (let i = 0; i <= 14; i++) {
          const tVal = (i / 14) * 4 - 2; // -2 to +2 std dev
          const bx = gOriginX + (i / 14) * 48;
          const by = gOriginY - Math.exp(-0.5 * tVal * tVal) * 22;
          bellPts.push([bx, by, cz + 7]);
        }
        addPolyline("detail", bellPts);

        registerComponent(comp, [cx - monW * 0.5, cx + monW * 0.5, scrTopY - 14, cy, cz - 12, cz + 14]);
        break;
      }

      // =========================================================================
      // 4) NEURAL NETWORK (Deep Learning, Transformers & Multi-Layer Perceptron)
      // =========================================================================
      case "neural-network": {
        const netW = w * 0.94;
        const netH = h * 0.88;
        const cenY = cy - netH * 0.52;

        // 5 Vertical Layer Planes arranged in perspective
        const layers = [
          { name: "IN", shape: "512", x: cx - netW * 0.42, count: 5, z: cz - 16 },
          { name: "CONV", shape: "256", x: cx - netW * 0.2, count: 7, z: cz - 8 },
          { name: "DENSE", shape: "128", x: cx, count: 8, z: cz },
          { name: "ATTN", shape: "64", x: cx + netW * 0.2, count: 6, z: cz + 8 },
          { name: "OUT", shape: "4", x: cx + netW * 0.42, count: 4, z: cz + 16 }
        ];

        const nodeCoordinates = [];
        const nodeRadius = clamp(netH * 0.024, 5, 8);

        // Generate Node Rings in each layer
        for (let l = 0; l < layers.length; l++) {
          const lay = layers[l];
          const layNodes = [];
          const stepY = clamp(netH / (lay.count + 1), 18, 38);
          const startY = cenY - ((lay.count - 1) * stepY) / 2;

          for (let i = 0; i < lay.count; i++) {
            const ny = startY + i * stepY;
            layNodes.push([lay.x, ny, lay.z]);

            // Concentric 3D Neuron Rings
            addCircle3D("prod", lay.x, ny, lay.z, nodeRadius, 16, "XY");
            addCircle3D("detail", lay.x, ny, lay.z, nodeRadius * 0.45, 12, "XY");
            // Glowing Nucleus Sparkle Dot inside node
            addDot(lay.x, ny, lay.z, 1.45, true);
          }
          nodeCoordinates.push(layNodes);

          // Layer Tensor Shape Annotations above each layer
          const topLabelY = cenY - netH * 0.46;
          addText3x5(`[${lay.shape}]`, lay.x - 14, topLabelY, lay.z, 0.7);
        }

        // Dense Synaptic Weight Connection Network (linking layer l to layer l+1)
        for (let l = 0; l < nodeCoordinates.length - 1; l++) {
          const fromNodes = nodeCoordinates[l];
          const toNodes = nodeCoordinates[l + 1];

          for (let i = 0; i < fromNodes.length; i++) {
            for (let j = 0; j < toNodes.length; j++) {
              const p1 = fromNodes[i];
              const p2 = toNodes[j];
              // Dense synapse wireframe lines
              addLine(i % 2 === j % 2 ? "prod" : "detail", p1, p2);

              // Traveling forward-propagation activation dots on select synapses
              if ((i + j) % 3 === 0) {
                const fStep = 0.25 + 0.5 * rand();
                const sx = lerp(p1[0], p2[0], fStep);
                const sy = lerp(p1[1], p2[1], fStep);
                const sz = lerp(p1[2], p2[2], fStep);
                addDot(sx, sy, sz, 1.25, true);
              }
            }
          }
        }

        // Floating Mathematical Formulation HUD: Attention(Q, K, V) = Softmax(QK^T / √d) V
        const eqBoxW = 180;
        const eqBoxH = 28;
        const eqBoxX = cx - eqBoxW / 2;
        const eqBoxY = cy - 22;
        addRect("prod", eqBoxX, eqBoxX + eqBoxW, eqBoxY, eqBoxY + eqBoxH, cz + 16);
        addText3x5("ATTN(Q,K,V) = SOFTMAX(QK/D)V", eqBoxX + 6, eqBoxY + 8, cz + 16, 0.65);

        registerComponent(comp, [cx - netW * 0.48, cx + netW * 0.48, cenY - netH * 0.5, cy, cz - 22, cz + 24]);
        break;
      }
    }

    // Prominent Shelf Lip Technical Label directly below the BIG object (no brackets)
    const labelText = comp.tag;
    const labelY = cy + 0.25 * k;
    const charWidth = 1.25;
    const textWidth = labelText.length * charWidth * 4;
    const labelStartX = cx - textWidth / 2;

    // Write 3x5 matrix dots text
    addText3x5(labelText, labelStartX, labelY, -0.6, charWidth);
  }

  return {
    lines,
    dots,
    figure: figurePlace && FigureClass ? new FigureClass(figureDef, figurePlace) : null,
    components
  };
}
