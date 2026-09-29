/* Canvas artwork for Fio. Collision geometry belongs exclusively to DuelCore. */
(function () {
  'use strict';

  const W = 1280, H = 720, GROUND = 560;
  const palette = {
    ink: '#263d3c', paper: '#efe8d9', mist: '#d9d5c4', teal: '#326d69',
    tealLight: '#72a69b', red: '#a95643', redLight: '#db8d67', gold: '#edcf90'
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));

  class DuelRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: false });
      this.previousBlades = [[], []];
      this.lastTime = -1;
      this.lastRound = -1;
      this.pixelRatio = 1;
      this.noise = this.makeNoise();
    }

    makeNoise() {
      const tile = document.createElement('canvas');
      tile.width = tile.height = 160;
      const context = tile.getContext('2d');
      const pixels = context.createImageData(160, 160);
      let seed = 19;
      for (let i = 0; i < pixels.data.length; i += 4) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        const value = (seed >>> 24) > 125 ? 255 : 24;
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
        pixels.data[i + 3] = (seed >>> 27) + 3;
      }
      context.putImageData(pixels, 0, 0);
      return this.ctx.createPattern(tile, 'repeat');
    }

    resize() {
      const bounds = this.canvas.getBoundingClientRect();
      this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * this.pixelRatio));
      const height = Math.max(1, Math.round(bounds.height * this.pixelRatio));
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
      }
      this.scale = Math.min(width / W, height / H);
      this.offsetX = (width - W * this.scale) / 2;
      this.offsetY = (height - H * this.scale) / 2;
    }

    path(points, fill, stroke, lineWidth = 1) {
      const c = this.ctx;
      c.beginPath();
      points.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
      if (fill) { c.closePath(); c.fillStyle = fill; c.fill(); }
      if (stroke) { c.strokeStyle = stroke; c.lineWidth = lineWidth; c.stroke(); }
    }

    line(x1, y1, x2, y2, color, width = 1) {
      const c = this.ctx;
      c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2);
      c.strokeStyle = color; c.lineWidth = width; c.stroke();
    }

    ellipse(x, y, rx, ry, color) {
      const c = this.ctx;
      c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      c.fillStyle = color; c.fill();
    }

    background(time) {
      const c = this.ctx;
      const sky = c.createLinearGradient(0, 0, 0, GROUND);
      sky.addColorStop(0, '#e9e6d9'); sky.addColorStop(.6, '#eee2cc'); sky.addColorStop(1, '#d1cdb4');
      c.fillStyle = sky; c.fillRect(0, 0, W, H);

      // A quiet, flat sunset supplies scale without competing with the blades.
      c.fillStyle = '#ce8060';
      c.beginPath(); c.arc(914, 263, 69, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#e8d9c1';
      c.fillRect(795, 281, 218, 3); c.fillRect(838, 301, 162, 2);
      this.path([[0, 367], [74, 337], [138, 350], [240, 293], [339, 352], [418, 334], [516, 364], [624, 319], [703, 344], [823, 321], [920, 366], [1055, 320], [1170, 354], [1280, 339], [1280, 570], [0, 570]], '#c7c8b9');
      this.path([[0, 412], [74, 396], [164, 401], [281, 369], [388, 416], [482, 405], [605, 365], [719, 414], [817, 391], [939, 401], [1047, 372], [1163, 406], [1280, 386], [1280, 570], [0, 570]], '#b6bcae');
      this.path([[0, 456], [102, 439], [231, 463], [361, 433], [471, 452], [586, 444], [712, 465], [838, 431], [972, 450], [1092, 438], [1196, 459], [1280, 448], [1280, 570], [0, 570]], '#9fae9e');

      // Fine horizon marks and the silhouettes of a distant cedar grove.
      c.globalAlpha = .25;
      for (let i = 0; i < 37; i++) {
        const x = i * 38 + 11;
        const y = 459 + Math.sin(i * .71) * 8;
        const h = 13 + Math.sin(i * 2.51) * 9;
        this.path([[x, y], [x + 6, y - h], [x + 13, y], [x + 10, y - 2], [x + 10, y + 8], [x + 5, y + 8], [x + 5, y - 2]], '#47635c');
      }
      c.globalAlpha = 1;
      const haze = c.createLinearGradient(0, 419, 0, 556);
      haze.addColorStop(0, '#e6dfc100'); haze.addColorStop(.82, '#e6dfc178'); haze.addColorStop(1, '#d5d1bba8');
      c.fillStyle = haze; c.fillRect(0, 419, W, 137);

      // Sparse birds; the composition remains useful at small viewport sizes.
      c.globalAlpha = .38;
      for (let i = 0; i < 3; i++) {
        const x = 705 + i * 25 + Math.sin(time * .05) * 16;
        const y = 222 + i % 2 * 12;
        const wing = 3 + Math.sin(time * 1.4 + i) * 1.4;
        this.path([[x - 7, y - wing], [x, y], [x + 7, y - wing + 1]], null, '#546a63', 1.1);
      }
      c.globalAlpha = 1;

      this.tree(time);
      this.grass(time);

      // Timber terrace, with precise horizontal silhouettes under the feet.
      c.fillStyle = '#8c8e77'; c.fillRect(0, 546, W, 14);
      this.line(0, 547, W, 547, '#acaa90', 2);
      c.fillStyle = '#d5c8ad'; c.fillRect(0, GROUND, W, 160);
      const floor = c.createLinearGradient(0, GROUND, 0, 720);
      floor.addColorStop(0, '#bcb59b'); floor.addColorStop(1, '#d2c6ae');
      c.fillStyle = floor; c.fillRect(0, GROUND, W, 160);
      this.line(0, GROUND + 1, W, GROUND + 1, '#465950', 3);
      this.line(0, GROUND + 5, W, GROUND + 5, '#e0d5bc', 2);
      [582, 617, 668].forEach((y, i) => {
        this.line(0, y, W, y, '#9d9e884d', i === 2 ? 1.5 : 1);
        this.line(0, y + 2, W, y + 2, '#eee2c333', 1);
      });
      [72, 310, 525, 789, 999, 1231].forEach((x, i) => this.line(x, 562, x + (x - 640) * .4, 720, '#888e783b', 1));
      c.globalAlpha = .1;
      for (let i = 0; i < 45; i++) {
        const x = (i * 271.7) % 1280;
        const y = 572 + (i * 23.21) % 138;
        this.line(x, y, x + 12 + i % 7 * 13, y, '#46584c', .65);
      }
      c.globalAlpha = 1;

      // Two floor marks give players a fixed, unobtrusive distance reference.
      for (const x of [445, 835]) {
        this.line(x - 15, 570, x + 15, 570, '#526c6066', 2);
        this.line(x, 567, x, 573, '#526c6066', 1);
      }
      this.ellipse(640, 574, 3, 1.8, '#627b6c66');

      // A roof, cropped to a few brush-like bars, frames the open dojo.
      this.path([[0, 0], [1280, 0], [1280, 15], [1140, 12], [960, 20], [721, 14], [417, 20], [119, 13], [0, 22]], '#283d38');
      this.path([[0, 0], [17, 0], [13, 375], [8, 465], [0, 465]], '#2d423b');
      this.path([[1267, 0], [1280, 0], [1280, 454], [1275, 461]], '#2d423b');
      this.line(34, 28, 1248, 28, '#3d53494d', 1);
      c.font = '10px "Courier New", monospace'; c.fillStyle = '#5470659c';
      c.textAlign = 'left'; c.fillText('DOJO 01', 48, 506);
      c.fillStyle = '#54706550'; c.fillText('一', 48, 523);
      c.textAlign = 'right'; c.fillStyle = '#54706576'; c.fillText('AO PÔR DO SOL', 1232, 518);
    }

    tree(time) {
      const c = this.ctx;
      c.save(); c.globalAlpha = .73;
      const dark = '#526a59';
      this.path([[34, 547], [45, 459], [45, 382], [34, 315], [24, 250], [22, 216], [35, 254], [44, 289], [50, 289], [71, 248], [62, 287], [53, 322], [59, 390], [54, 449], [53, 490], [65, 547]], dark);
      this.path([[46, 350], [89, 319], [128, 307], [164, 305], [125, 315], [96, 332], [53, 367]], dark);
      this.path([[43, 308], [84, 271], [136, 250], [113, 267], [80, 285], [49, 325]], dark);
      this.path([[39, 419], [82, 398], [107, 366], [91, 399], [48, 439]], dark);
      for (let i = 0; i < 31; i++) {
        const x = 17 + (Math.sin(i * 12.98) * .5 + .5) * 161;
        const y = 213 + (Math.sin(i * 7.72) * .5 + .5) * 103;
        const sway = Math.sin(time * .55 + i) * 2;
        this.ellipse(x + sway, y, 21 + i % 4 * 4, 5 + i % 3, dark);
      }
      c.restore();
      // One red paper ribbon catches the breeze, echoing the opponent's palette.
      this.path([[47, 389], [63, 387], [65 + Math.sin(time) * 3, 422], [56, 414]], '#b8654b');
      this.line(48, 390, 59, 390, '#e3b686', 2);
    }

    grass(time) {
      const c = this.ctx;
      c.save(); c.globalAlpha = .58;
      for (let i = 0; i < 73; i++) {
        const x = i * 18 + 7;
        const height = 5 + (Math.sin(i * 12.143) * .5 + .5) * 19;
        const sway = Math.sin(time * .65 + i * .17) * 3;
        c.beginPath(); c.moveTo(x, 547);
        c.quadraticCurveTo(x + sway, 547 - height * .65, x + 3 + sway, 547 - height);
        c.strokeStyle = '#728671'; c.lineWidth = 1; c.stroke();
      }
      c.restore();
    }

    fighter(f, time, blade) {
      const c = this.ctx;
      const enemy = f.id === 1;
      const color = enemy ? palette.red : palette.teal;
      const light = enemy ? palette.redLight : palette.tealLight;
      const dark = enemy ? '#513c35' : '#263f3c';
      const kind = f.kind || 'knight';
      const knight = kind === 'knight', lancer = kind === 'lancer', assassin = kind === 'assassin';
      const facing = f.facing || 1;
      const state = f.state;
      const isDead = state === 'dead' || f.dead;
      const foot = f.y || GROUND;
      const moving = !isDead && (Math.abs(f.vx || 0) > 4 || Math.abs(f.move || 0) > .1);
      const walking = moving && (state === 'idle' || state === 'dash');
      const step = walking ? Math.sin(time * (state === 'dash' ? 28 : 13)) : 0;
      const idle = state === 'idle' ? Math.sin(time * 2.1 + f.id * 3) * 1.2 : 0;
      const death = clamp((f.deathTime || 0) / .54);

      c.save();
      this.ellipse(f.x + (isDead ? facing * death * 24 : 0), foot + 3, isDead ? 24 + death * 27 : 29, 5, '#354f4533');
      c.translate(f.x, foot);
      if (isDead) {
        c.translate(-facing * death * 13, death * 4);
        c.rotate(-facing * (Math.PI / 2) * (1 - Math.pow(1 - death, 3)));
      }
      if (state === 'dash') {
        c.globalAlpha = .13;
        this.path([[-facing * 65, -114], [-facing * 9, -114], [-facing * 11, -24], [-facing * 79, -24]], color);
        c.globalAlpha = 1;
      }
      // All classes occupy the same head/body capsule. A low ninja posture is
      // conveyed by bent legs and a forward shoulder, never by hiding the hurtbox.
      const lean = state === 'stunned' ? -facing * 6 : state === 'recovery' ? facing * 3 : state === 'dash' ? facing * 5 : assassin ? facing * 2 : 0;
      const hip = -45;
      const kneeY = -25;

      // Rear leg and tabi. Feet stay planted when preparing or recovering.
      this.line(-facing * 7, hip, -facing * (15 + step * 7), kneeY, dark, 12);
      this.line(-facing * (15 + step * 7), kneeY, -facing * (22 + step * 8), -5, dark, 9);
      this.path([[-facing * (23 + step * 8) - 5, -8], [-facing * (23 + step * 8) + 4, -8], [-facing * (23 + step * 8) + 8, -1], [-facing * (23 + step * 8) - 7, -1]], '#263a34');
      this.line(facing * 5, hip, facing * (15 + step * 7), kneeY, color, 13);
      this.line(facing * (15 + step * 7), kneeY, facing * (24 + step * 9), -5, '#34483e', 9);
      this.path([[facing * (24 + step * 9) - 5, -8], [facing * (24 + step * 9) + 4, -8], [facing * (24 + step * 9) + 10, -1], [facing * (24 + step * 9) - 7, -1]], '#263a34');

      if (knight) {
        // Greaves and knee plates make armor legible without changing damage.
        this.line(facing * (15 + step * 7), -24, facing * (24 + step * 9), -9, '#84948c', 7);
        this.line(-facing * (15 + step * 7), -24, -facing * (22 + step * 8), -9, '#596d65', 6);
        this.ellipse(facing * (15 + step * 7), -25, 6, 5, light);
        this.line(facing * (18 + step * 8), -21, facing * (23 + step * 9), -10, '#c0c9b7', 1);
      } else if (lancer) {
        this.line(facing * (17 + step * 7), -20, facing * (24 + step * 9), -8, '#c6b694', 6);
        this.line(-facing * (17 + step * 7), -20, -facing * (22 + step * 8), -8, '#9e967d', 5);
        for (let i = 0; i < 3; i++) this.line(facing * (17 + step * 7) - 3, -19 + i * 4, facing * (17 + step * 7) + 4, -19 + i * 4, dark, 1);
      } else {
        this.line(facing * (19 + step * 8), -18, facing * (24 + step * 9), -9, light, 2);
      }

      // Garment silhouette is kept close to the actual body capsule.
      this.path([[-17 + lean, -94 + idle], [12 + lean, -98 + idle], [18, -60], [23, -35], [-25, -33], [-19, -57]], color);
      this.path([[-17 + lean, -94 + idle], [-5 + lean, -91 + idle], [4, -54], [-12, -36], [-25, -33], [-19, -59]], dark);
      this.path([[12 + lean, -98 + idle], [5 + lean, -86 + idle], [-1, -60]], null, light, 2);
      this.path([[-17, -60], [18, -62], [19, -53], [-18, -51]], '#d6c6a1');
      this.line(4, -51, 7 + Math.sin(time * 3) * 1.5, -34, '#dccbaa', 3);
      this.line(-3, -33, -2, -49, light + '88', 1);

      if (knight) {
        this.path([[-15 + lean, -94 + idle], [11 + lean, -97 + idle], [15, -67], [5, -61], [-15, -65]], '#70867e');
        this.path([[-13 + lean, -92 + idle], [-3 + lean, -92 + idle], [3, -66], [-13, -68]], '#536d64');
        this.line(lean + 1, -91 + idle, 6, -67, '#bac5b1', 1.3);
        this.path([[lean - 18, -98 + idle], [lean - 7, -98 + idle], [lean - 7, -88 + idle], [lean - 21, -87 + idle]], color);
        this.path([[lean + 7, -100 + idle], [lean + 19, -96 + idle], [lean + 20, -86 + idle], [lean + 8, -88 + idle]], light);
        this.line(-14, -71, 12, -74, '#afbaa6', 1);
        this.path([[5, -61], [15, -62], [18, -37], [8, -32]], light);
        this.line(-13, -45, 4, -47, '#90a094', 1);
      } else if (lancer) {
        this.path([[-15 + lean, -96 + idle], [9 + lean, -97 + idle], [15, -67], [-15, -64]], '#b8ad8d');
        this.path([[-15 + lean, -96 + idle], [-5 + lean, -92 + idle], [-2, -66], [-15, -64]], '#858971');
        this.path([[lean + 4, -98 + idle], [lean + 13, -96 + idle], [9, -60], [-1, -61]], color);
        for (let i = 0; i < 4; i++) this.line(-12, -87 + i * 6, 9, -90 + i * 6, '#6b7862', 1.3);
        this.path([[-15, -60], [14, -62], [17, -44], [-16, -42]], color);
        this.line(-8, -58, -7, -45, light, 1);
        this.line(2, -59, 3, -45, light, 1);
      } else {
        this.path([[-14 + lean, -95 + idle], [10 + lean, -98 + idle], [14, -62], [-15, -59]], dark);
        this.path([[lean + 8, -97 + idle], [lean + 15, -93 + idle], [-8, -58], [-15, -60]], color);
        this.line(lean - 8, -91 + idle, 11, -62, light, 1.5);
        this.path([[-15, -60], [16, -62], [17, -54], [-16, -52]], color);
        const tail = 19 + (state === 'dash' ? 14 : 0);
        this.path([[-facing * 9, -56], [-facing * (tail + 11), -50 + Math.sin(time * 4) * 3], [-facing * tail, -45], [-facing * 7, -52]], color);
      }

      // Head, tied hair, and headband establish orientation with few shapes.
      this.line(lean, -98 + idle, lean, -104 + idle, '#c9ad87', 9);
      this.ellipse(lean, -119 + idle, 12, 13, '#ddc09b');
      if (knight) {
        this.path([[lean - 12, -111 + idle], [lean - 13, -128 + idle], [lean - 6, -136 + idle], [lean + 6, -136 + idle], [lean + 13, -128 + idle], [lean + 13, -112 + idle], [lean + 3, -105 + idle]], '#789087');
        this.path([[lean - 12, -111 + idle], [lean - 13, -128 + idle], [lean - 4, -134 + idle], [lean - 4, -109 + idle]], dark);
        this.line(lean - 9, -122 + idle, lean + 11, -122 + idle, '#243b36', 4);
        this.line(lean + facing * 4, -122 + idle, lean + facing * 11, -122 + idle, '#e2dfbf', 1);
        this.line(lean + 1, -132 + idle, lean + 2, -111 + idle, '#c0cabb', 1.4);
        this.path([[lean - 2, -136 + idle], [lean - facing * 6, -142 + idle], [lean - facing * 20, -136 + idle], [lean - facing * 12, -135 + idle]], color);
      } else if (lancer) {
        this.path([[lean - 13, -118 + idle], [lean - 12, -130 + idle], [lean - 4, -136 + idle], [lean + 8, -133 + idle], [lean + 13, -122 + idle], [lean + facing * 11, -124 + idle], [lean - facing * 5, -125 + idle], [lean - facing * 10, -112 + idle]], '#677c69');
        this.line(lean - 12, -123 + idle, lean + 12, -123 + idle, light, 3);
        this.path([[lean - facing * 8, -120 + idle], [lean - facing * 11, -108 + idle], [lean - facing * 5, -105 + idle], [lean - facing * 4, -119 + idle]], dark);
        this.path([[lean, -135 + idle], [lean - facing * 5, -145 + idle], [lean - facing * 11, -148 + idle], [lean - facing * 8, -134 + idle]], color);
        this.line(lean + facing * 7, -118 + idle, lean + facing * 12, -118 + idle, '#3b4a40', 1.4);
      } else {
        this.path([[lean - 13, -113 + idle], [lean - 14, -126 + idle], [lean - 7, -136 + idle], [lean + 5, -136 + idle], [lean + 14, -125 + idle], [lean + 12, -109 + idle], [lean - 7, -105 + idle]], dark);
        this.path([[lean - 10, -130 + idle], [lean - 5, -134 + idle], [lean + 5, -133 + idle], [lean + 11, -126 + idle]], null, color, 2.5);
        this.line(lean - 2, -122 + idle, lean + facing * 11, -122 + idle, '#ddc09b', 3.5);
        this.line(lean + facing * 6, -122 + idle, lean + facing * 11, -122 + idle, '#f3eac8', 1);
        this.path([[lean - 10, -116 + idle], [lean + 11, -118 + idle], [lean + 8, -106 + idle], [lean - 9, -106 + idle]], color);
        const ribbonX = lean - facing * 11;
        this.path([[ribbonX, -119 + idle], [ribbonX - facing * (22 + Math.sin(time * 2.2) * 3), -114 + idle], [ribbonX - facing * 12, -111 + idle]], light);
      }

      const hand = blade ? { x: blade.hand.x - f.x, y: blade.hand.y - foot } : { x: facing * 23, y: -75 };
      const shoulder = { x: lean + facing * 9, y: -91 + idle };
      const elbow = { x: lerp(shoulder.x, hand.x, .58) - facing * 4, y: Math.max(shoulder.y, hand.y) + 11 };
      this.line(shoulder.x, shoulder.y, elbow.x, elbow.y, color, 13);
      this.line(elbow.x, elbow.y, hand.x - facing * 3, hand.y + 1, light, 8);
      this.ellipse(hand.x, hand.y, 4.5, 4, '#dfc19a');
      let support = {x: hand.x - facing * 6, y: hand.y + 5};
      if (lancer && blade && blade.shaft) {
        const dx = blade.b.x - blade.a.x, dy = blade.b.y - blade.a.y;
        const length = Math.hypot(dx, dy) || 1;
        support = {x: hand.x - dx / length * 25, y: hand.y - dy / length * 25};
      }
      this.line(lean - facing * 11, -87, support.x, support.y, dark, 8);
      this.ellipse(support.x, support.y, 4, 3.5, '#d0ad85');
      if (knight) {
        this.line(elbow.x, elbow.y, hand.x - facing * 4, hand.y + 1, '#8d9e90', 6);
        this.ellipse(elbow.x, elbow.y, 5, 5, light);
      } else if (lancer) {
        this.line(elbow.x + facing * 3, elbow.y - 1, hand.x - facing * 4, hand.y, '#c5b492', 5);
      } else {
        this.line(elbow.x, elbow.y, hand.x - facing * 4, hand.y + 1, dark, 6);
        this.line(hand.x - facing * 6, hand.y - 2, hand.x - facing * 6, hand.y + 3, light, 2);
      }
      if (state === 'stunned') {
        c.globalAlpha = .7;
        this.line(-12, -148, -16, -154, '#f7d78e', 1.4);
        this.line(0, -149, 0, -158, '#f7d78e', 1.4);
        this.line(12, -148, 16, -154, '#f7d78e', 1.4);
      }
      c.restore();

      if (isDead) {
        // A fallen weapon is decorative after lethal contact, never a live blade.
        c.save(); c.globalAlpha = 1 - death * .15;
        const fallenLength = lancer ? 171 : assassin ? 48 : 99;
        const x = f.x + facing * 17, y = foot - 3;
        const angle = -(1 - death) * .7;
        const endX = x + facing * Math.cos(angle) * fallenLength, endY = y + Math.sin(angle) * fallenLength;
        this.line(x, y, endX, endY, lancer ? '#695947' : '#c7cfb9', lancer ? 4 : 3);
        if (lancer) this.line(lerp(x, endX, .79), lerp(y, endY, .79), endX, endY, '#e7e9d4', 4);
        c.restore();
      }
    }

    sword(f, blade, time) {
      if (!blade || f.dead || f.state === 'dead') return;
      const c = this.ctx;
      const state = f.state;
      const hand = blade.hand;
      const dx = blade.b.x - blade.a.x, dy = blade.b.y - blade.a.y;
      const length = Math.hypot(dx, dy) || 1;
      const ux = dx / length, uy = dy / length;
      const nx = -uy, ny = ux;
      const trails = this.previousBlades[f.id] || [];

      if (state === 'active' && trails.length) {
        for (let i = 0; i < trails.length; i++) {
          const old = trails[i];
          c.globalAlpha = (i + 1) / trails.length * .13;
          this.path([[old.a.x, old.a.y], [old.b.x, old.b.y], [blade.b.x, blade.b.y], [blade.a.x, blade.a.y]], f.id === 0 ? '#f9f7d9' : '#ffe0b1');
        }
        c.globalAlpha = 1;
      }

      if (state === 'startup') {
        const pulse = .35 + Math.sin(time * 33) * .08;
        this.line(blade.a.x, blade.a.y, blade.b.x, blade.b.y, `rgba(202,137,65,${pulse})`, 7);
        this.ellipse(blade.b.x, blade.b.y, 2.7, 2.7, '#e1b978');
      }

      if (blade.shaft) {
        // The dull wooden shaft is visual only. Only the bright metal tip is
        // blade.a -> blade.b, the exact segment used by the collision engine.
        this.line(blade.shaft.a.x, blade.shaft.a.y, blade.shaft.b.x, blade.shaft.b.y, '#463f34', 5);
        this.line(blade.shaft.a.x, blade.shaft.a.y, blade.shaft.b.x, blade.shaft.b.y, '#a4885b', 2.7);
        this.line(blade.a.x - ux * 10, blade.a.y - uy * 10, blade.a.x, blade.a.y, '#404f42', 6);
        for (let i = 2; i < 11; i += 3) this.line(blade.a.x - ux * i + nx * 2, blade.a.y - uy * i + ny * 2, blade.a.x - ux * i - nx * 2, blade.a.y - uy * i - ny * 2, '#c2b393', 1);
        this.path([[blade.a.x + nx * 2.5, blade.a.y + ny * 2.5], [blade.a.x + ux * length * .2 + nx * 3.1, blade.a.y + uy * length * .2 + ny * 3.1], [blade.b.x, blade.b.y], [blade.a.x + ux * length * .2 - nx * 3.1, blade.a.y + uy * length * .2 - ny * 3.1], [blade.a.x - nx * 2.5, blade.a.y - ny * 2.5]], '#f4f4df', '#344b43', 1);
        this.line(blade.a.x, blade.a.y, blade.b.x, blade.b.y, '#b4c6b4', 1);
      } else {
        this.line(hand.x - ux * 10, hand.y - uy * 10, blade.a.x, blade.a.y, '#263b36', 5);
        for (let i = -5; i < 11; i += 5) this.line(hand.x + ux * i + nx * 2, hand.y + uy * i + ny * 2, hand.x + ux * (i + 2) - nx * 2, hand.y + uy * (i + 2) - ny * 2, '#b5b49a', 1);
        const guardSize = f.kind === 'assassin' ? 4 : 7;
        this.line(blade.a.x + nx * guardSize, blade.a.y + ny * guardSize, blade.a.x - nx * guardSize, blade.a.y - ny * guardSize, '#b79b69', 3);
        this.line(blade.a.x, blade.a.y, blade.b.x, blade.b.y, '#344b43', 5);
        this.line(blade.a.x, blade.a.y, blade.b.x, blade.b.y, '#f4f4df', 2.8);
        this.line(blade.a.x + nx, blade.a.y + ny, blade.b.x + nx, blade.b.y + ny, '#c1d2bd', .7);
      }

      if (state === 'parry') {
        c.save(); c.globalAlpha = .9;
        this.line(blade.a.x, blade.a.y, blade.b.x, blade.b.y, '#fffadc', 4);
        const gx = lerp(blade.a.x, blade.b.x, .48), gy = lerp(blade.a.y, blade.b.y, .48);
        this.line(gx - 8, gy, gx + 8, gy, '#fff7cf', 1);
        this.line(gx, gy - 8, gx, gy + 8, '#fff7cf', 1);
        c.globalAlpha = .25;
        this.line(blade.a.x + nx * 5, blade.a.y + ny * 5, blade.b.x + nx * 5, blade.b.y + ny * 5, '#ffffdd', 1);
        c.restore();
      }
    }

    drawPortrait(canvas, kind, side = 0) {
      if (!canvas || !canvas.getContext) return;
      const context = canvas.getContext('2d');
      if (!context) return;
      const previousContext = this.ctx;
      const previousTrails = this.previousBlades;
      this.ctx = context;
      this.previousBlades = [[], []];
      context.save();
      try {
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / 160, canvas.height / 200);
        context.setTransform(scale, 0, 0, scale, (canvas.width - 160 * scale) / 2, (canvas.height - 200 * scale) / 2);
        context.lineCap = 'round'; context.lineJoin = 'round';
        const tone = side === 1 ? palette.red : palette.teal;
        context.globalAlpha = .07;
        this.ellipse(78, 98, 49, 70, tone);
        context.globalAlpha = .2;
        this.line(33, 188, 127, 188, tone, 1);
        this.line(78, 10, 78, 25, tone, 1);
        context.globalAlpha = 1;
        const f = { id: side, kind, x: 65, y: 183, facing: 1, state: 'idle', stateTime: 0, duration: 0, dead: false, vx: 0, move: 0 };
        const hand = {x: 93, y: 115};
        // Portrait grip is posed separately so all three weapons fit the card.
        // Gameplay always draws the untouched geometry returned by DuelCore.
        const original = globalThis.DuelCore && globalThis.DuelCore.blade ? globalThis.DuelCore.blade(f) : null;
        const length = original ? Math.hypot(original.b.x - original.a.x, original.b.y - original.a.y) : kind === 'assassin' ? 50 : kind === 'lancer' ? 38 : 99;
        const ux = .13, uy = -Math.sqrt(1 - .13 * .13);
        let blade;
        if (kind === 'lancer') {
          const a = {x: 106, y: 48};
          blade = {hand, angle: Math.atan2(uy, ux), a, b: {x: a.x + ux * length, y: a.y + uy * length}, shaft: {a: {x: 82, y: 185}, b: a}};
        } else {
          const a = {x: hand.x + ux * 13, y: hand.y + uy * 13};
          blade = {hand, angle: Math.atan2(uy, ux), a, b: {x: a.x + ux * length, y: a.y + uy * length}};
        }
        this.fighter(f, 0, blade);
        this.sword(f, blade, 0);
      } finally {
        context.restore();
        this.ctx = previousContext;
        this.previousBlades = previousTrails;
      }
    }

    particles(effects) {
      const c = this.ctx;
      for (const p of effects.particles || []) {
        const alpha = clamp(p.life / (p.maxLife || .4));
        c.globalAlpha = alpha;
        const size = p.size || 2;
        if (Math.hypot(p.vx || 0, p.vy || 0) > 100) {
          this.line(p.x, p.y, p.x - (p.vx || 0) * .016, p.y - (p.vy || 0) * .016, p.color || '#ffe3a0', size);
        } else this.ellipse(p.x, p.y, size, size * .65, p.color || '#ffe3a0');
      }
      c.globalAlpha = 1;
      for (const cut of effects.cuts || []) {
        const progress = 1 - clamp(cut.life / (cut.maxLife || .25));
        c.save(); c.translate(cut.x, cut.y); c.rotate(cut.angle || -.6);
        c.globalAlpha = Math.pow(1 - progress, 1.8);
        const length = 85 + progress * 90;
        this.path([[-length, 0], [-length * .16, -4 * (1 - progress)], [length, 0], [length * .12, 3 * (1 - progress)]], '#fffae0');
        this.line(-length * .78, 3, length * .6, 3, '#b35f44', 1);
        c.restore();
      }
    }

    render(game, effects = {}, nowSeconds = 0) {
      this.resize();
      const c = this.ctx;
      const time = Number.isFinite(nowSeconds) ? nowSeconds : 0;
      if (this.lastRound !== game.round) {
        this.previousBlades = [[], []]; this.lastRound = game.round;
      }
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.fillStyle = '#e7e1d1'; c.fillRect(0, 0, this.canvas.width, this.canvas.height);
      c.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY);
      c.save();
      c.beginPath(); c.rect(0, 0, W, H); c.clip();
      const shake = Math.max(0, effects.shake || 0);
      if (shake) c.translate(Math.sin(time * 127) * shake, Math.cos(time * 151) * shake * .6);
      this.background(time);
      const fighters = game.fighters || [];
      const blades = fighters.map(f => globalThis.DuelCore && globalThis.DuelCore.blade ? globalThis.DuelCore.blade(f) : null);
      c.lineCap = 'round'; c.lineJoin = 'round';
      fighters.forEach((f, i) => this.fighter(f, time, blades[i]));
      fighters.forEach((f, i) => this.sword(f, blades[i], time));
      this.particles(effects);
      c.lineCap = 'butt'; c.lineJoin = 'miter';
      c.restore();
      if (effects.flash > 0) {
        c.globalAlpha = clamp(effects.flash) * .45;
        c.fillStyle = '#fffbe3'; c.fillRect(0, 0, W, H); c.globalAlpha = 1;
      }
      c.fillStyle = this.noise; c.globalAlpha = .3; c.fillRect(0, 0, W, H); c.globalAlpha = 1;
      const vignette = c.createRadialGradient(640, 370, 190, 640, 370, 760);
      vignette.addColorStop(0, '#21362d00'); vignette.addColorStop(1, '#21362d19');
      c.fillStyle = vignette; c.fillRect(0, 0, W, H);

      if (time !== this.lastTime) {
        fighters.forEach((f, i) => {
          const blade = blades[i];
          if (!blade || f.state !== 'active') { this.previousBlades[f.id] = []; return; }
          const list = this.previousBlades[f.id] || (this.previousBlades[f.id] = []);
          list.push({ a: { ...blade.a }, b: { ...blade.b } });
          if (list.length > 3) list.shift();
        });
        this.lastTime = time;
      }
    }
  }

  globalThis.DuelRenderer = DuelRenderer;
})();
