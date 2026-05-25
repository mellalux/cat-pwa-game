    // PWA help modal
    document.getElementById('pwaHelpBtn').addEventListener('click', function() {
      document.getElementById('pwaHelpModal').style.display = 'flex';
    });
    document.getElementById('closePwaHelp').addEventListener('click', function() {
      document.getElementById('pwaHelpModal').style.display = 'none';
    });
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./js/sw.js').catch(() => {});
      });
    }

    // PWA automaatne uuendamine: kui uus service worker on saadaval, lae leht automaatselt uuesti
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', function() {
        // Kui SW vahetub, lae leht uuesti
        window.location.reload();
      });
      navigator.serviceWorker.ready.then(function(reg) {
        if (reg.waiting) {
          // Kui juba ootab uus SW, uuenda kohe
          window.location.reload();
        }
      });
    }

    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d', { alpha: true });
    const scoreEl = document.getElementById('score');
    const speedEl = document.getElementById('speed');
    const modeBtn = document.getElementById('modeBtn');
    const speedBtn = document.getElementById('speedBtn');
    const resetBtn = document.getElementById('resetBtn');
    const start = document.getElementById('start');
    const startBtn = document.getElementById('startBtn');

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let running = false;
    let last = 0;
    let score = 0;
    let speedLevel = 1;
    let mode = 'mouse';
    let pulse = 0;

    const pointerBursts = [];
    const stars = [];

    const target = {
      x: 200,
      y: 200,
      vx: 180,
      vy: 140,
      r: 34,
      angle: 0,
      wobble: 0,
    };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      target.x = Math.min(Math.max(target.x, target.r), w - target.r);
      target.y = Math.min(Math.max(target.y, target.r), h - target.r);
    }

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function setScore(value) {
      score = value;
      scoreEl.textContent = String(score);
      // Kiirenda iga 10 punkti järel
      const newSpeed = 1 + Math.floor(score / 10) * 0.25;
      if (newSpeed !== speedLevel) {
        speedLevel = newSpeed;
        speedEl.textContent = speedLevel.toFixed(2).replace(/\.00$/, '.0') + '×';
        randomVelocity();
        if (typeof playSound === 'function') playSound('mode'); // lisa heliefekt kiiruse muutusele
      }
    }

    function randomVelocity() {
      const base = rand(150, 245) * speedLevel;
      const a = rand(0, Math.PI * 2);
      target.vx = Math.cos(a) * base;
      target.vy = Math.sin(a) * base;
    }

    function resetTarget() {
      target.x = rand(target.r + 20, Math.max(target.r + 21, w - target.r - 20));
      target.y = rand(target.r + 70, Math.max(target.r + 71, h - target.r - 80));
      randomVelocity();
    }

    function addBurst(x, y) {
      pointerBursts.push({ x, y, life: 0.34, max: 0.34 });
      for (let i = 0; i < 16; i++) {
        stars.push({
          x, y,
          vx: rand(-230, 230),
          vy: rand(-230, 230),
          r: rand(2, 5),
          life: rand(.35, .75),
          max: .75,
        });
      }
      if (typeof playSound === 'function') playSound('burst');
    }

    function catchTarget(x, y) {
      const dx = x - target.x;
      const dy = y - target.y;
      const distance = Math.hypot(dx, dy);
      addBurst(x, y);

      if (distance < target.r + 46) {
        setScore(score + 1);
        pulse = 1;
        target.x = Math.min(Math.max(target.x + dx * .25, target.r), w - target.r);
        target.y = Math.min(Math.max(target.y + dy * .25, target.r), h - target.r);
        randomVelocity();
        if (typeof playSound === 'function') playSound('catch_' + mode);
      }
    }

    function pointerPos(event) {
      const t = event.touches ? event.touches[0] : event;
      return { x: t.clientX, y: t.clientY };
    }


    // Support both click and touch events for catching the target
    function handleCatchEvent(event) {
      event.preventDefault();
      let x, y;
      if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
      } else {
        x = event.clientX;
        y = event.clientY;
      }
      catchTarget(x, y);
    }
    canvas.addEventListener('pointerdown', handleCatchEvent, { passive: false });
    canvas.addEventListener('touchstart', handleCatchEvent, { passive: false });
    canvas.addEventListener('click', handleCatchEvent, { passive: false });

    canvas.addEventListener('pointermove', (event) => {
      if (!event.isPrimary) return;
      if (event.buttons === 1 || event.pointerType === 'touch') {
        event.preventDefault();
        const now = performance.now();
        if (!canvas._lastTrail || now - canvas._lastTrail > 60) {
          canvas._lastTrail = now;
          addBurst(event.clientX, event.clientY);
        }
      }
    }, { passive: false });

    function drawBackground(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.globalAlpha = .35;
      for (let i = 0; i < 18; i++) {
        const x = (i * 137 + t * 12) % (w + 120) - 60;
        const y = (i * 83 + Math.sin(t * .5 + i) * 30) % (h + 120) - 60;
        ctx.beginPath();
        ctx.arc(x, y, 2 + (i % 4), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,.4)';
        ctx.fill();
      }
      ctx.restore();
    }

    function drawMouse() {
      ctx.save();
      ctx.translate(target.x, target.y);
      ctx.rotate(target.angle);
      // Suurenda hiirt (skaala 1.5x)
      const s = 1.5 + pulse * .35;
      ctx.scale(s, s);

      ctx.shadowColor = 'rgba(0,0,0,.35)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;

      // Hiire keha
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.bezierCurveTo(4, -26, -33, -20, -38, 0);
      ctx.bezierCurveTo(-33, 20, 4, 26, 18, 0);
      ctx.fillStyle = '#cbd5e1';
      ctx.fill();

      // Kõrvad
      ctx.beginPath();
      ctx.arc(-20, -16, 10, 0, Math.PI * 2);
      ctx.arc(-20, 16, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      // Nina
      ctx.beginPath();
      ctx.arc(15, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // Silmad
      ctx.beginPath();
      ctx.arc(-6, -8, 3, 0, Math.PI * 2);
      ctx.arc(-6, 8, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      // Animeeritud saba
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-38, 0);
      // Sabajuur ja esimene segment on alati otse
      const t = performance.now() * 0.004;
      // Kasutame sin(t) ja cos(t) mõlemat, et saba "vookleks" mõlemas suunas
      const wagX = Math.sin(t) * 20; // horisontaalne vooklemine
      const wagY = Math.cos(t * 1.3) * 15; // vertikaalne vooklemine
      // Nihutame kontrollpunkte, et saba oleks sümmeetrilisem
      ctx.bezierCurveTo(
        -60, -0, // esimene kontrollpunkt: alati otse
        -80 + wagX * 0.5, 25 + wagY * 1.5, // keskosa liigub mõlemas suunas rohkem
        -98 + wagX, 18 + wagY // saba tipp liigub mõlemas suunas rohkem
      );
      ctx.strokeStyle = '#fda4af';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    }

    function drawLaser() {
      const grd = ctx.createRadialGradient(target.x, target.y, 2, target.x, target.y, target.r * 2.2);
      grd.addColorStop(0, 'rgba(255,255,255,1)');
      grd.addColorStop(.18, 'rgba(248,113,113,.98)');
      grd.addColorStop(.55, 'rgba(239,68,68,.38)');
      grd.addColorStop(1, 'rgba(239,68,68,0)');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.r * (1.45 + pulse * .3), 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.restore();
    }

    function drawFeather() {
      ctx.save();
      ctx.translate(target.x, target.y);
      ctx.rotate(target.angle + Math.sin(target.wobble) * .35);
      const s = 1 + pulse * .18;
      ctx.scale(s, s);
      ctx.shadowColor = 'rgba(0,0,0,.35)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;

      const colors = ['#22c55e', '#06b6d4', '#facc15', '#fb7185'];
      for (let i = 0; i < 4; i++) {
        ctx.rotate((Math.PI * 2) / 4);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(18, -16, 54, -16, 70, 0);
        ctx.bezierCurveTo(48, 12, 18, 16, 0, 0);
        ctx.fillStyle = colors[i];
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#fff7ed';
      ctx.fill();
      ctx.restore();
    }

    function drawTarget() {
      if (mode === 'mouse') drawMouse();
      if (mode === 'laser') drawLaser();
      if (mode === 'feather') drawFeather();
    }

    function drawEffects(dt) {
      for (let i = pointerBursts.length - 1; i >= 0; i--) {
        const b = pointerBursts[i];
        b.life -= dt;
        const p = 1 - b.life / b.max;
        ctx.save();
        ctx.globalAlpha = Math.max(0, b.life / b.max);
        ctx.beginPath();
        ctx.arc(b.x, b.y, 18 + p * 70, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,.8)';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
        if (b.life <= 0) pointerBursts.splice(i, 1);
      }

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.life -= dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 260 * dt;
        ctx.save();
        ctx.globalAlpha = Math.max(0, s.life / s.max);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,.95)';
        ctx.fill();
        ctx.restore();
        if (s.life <= 0) stars.splice(i, 1);
      }
    }

    function update(dt) {
      const wobble = Math.sin(performance.now() * .002) * 26;
      target.x += (target.vx + wobble) * dt;
      target.y += (target.vy + Math.cos(performance.now() * .0017) * 22) * dt;
      target.angle = Math.atan2(target.vy, target.vx);
      target.wobble += dt * 6;

      const marginTop = 52;
      const marginBottom = 72;
      if (target.x < target.r) { target.x = target.r; target.vx = Math.abs(target.vx); }
      if (target.x > w - target.r) { target.x = w - target.r; target.vx = -Math.abs(target.vx); }
      if (target.y < target.r + marginTop) { target.y = target.r + marginTop; target.vy = Math.abs(target.vy); }
      if (target.y > h - target.r - marginBottom) { target.y = h - target.r - marginBottom; target.vy = -Math.abs(target.vy); }

      // Vahel muudab suunda, et kassil oleks huvitavam.
      if (Math.random() < dt * .55) {
        target.vx += rand(-80, 80) * speedLevel;
        target.vy += rand(-80, 80) * speedLevel;
        const max = 330 * speedLevel;
        const len = Math.hypot(target.vx, target.vy) || 1;
        if (len > max) {
          target.vx = target.vx / len * max;
          target.vy = target.vy / len * max;
        }
      }

      pulse = Math.max(0, pulse - dt * 3.3);
    }

    function loop(now) {
      if (!running) return;
      const dt = Math.min(.033, (now - last) / 1000 || .016);
      last = now;
      const t = now / 1000;
      update(dt);
      drawBackground(t);
      drawTarget();
      drawEffects(dt);
      requestAnimationFrame(loop);
    }

    function startGame() {
      start.classList.add('hidden');
      running = true;
      last = performance.now();
      resetTarget();
      requestAnimationFrame(loop);
      if (typeof playSound === 'function') playSound('start');
    }

    // Support both click and touch for start button
    function handleStartEvent(event) {
      event.preventDefault();
      startGame();
    }
    startBtn.addEventListener('click', handleStartEvent, { passive: false });
    startBtn.addEventListener('touchstart', handleStartEvent, { passive: false });

    modeBtn.addEventListener('click', () => {
      const modes = ['mouse', 'laser', 'feather'];
      mode = modes[(modes.indexOf(mode) + 1) % modes.length];
      const label = mode === 'mouse' ? 'mouse' : mode === 'laser' ? 'laser' : 'feather';
      modeBtn.textContent = 'Target: ' + label;
      target.r = mode === 'laser' ? 26 : mode === 'feather' ? 38 : 51; // hiir on nüüd suurem
      if (typeof playSound === 'function') playSound('mode');
    });

    speedBtn.addEventListener('click', () => {
      speedLevel = speedLevel >= 2 ? 0.75 : +(speedLevel + .25).toFixed(2);
      speedEl.textContent = speedLevel.toFixed(2).replace(/\.00$/, '.0') + '×';
      randomVelocity();
    });

    resetBtn.addEventListener('click', () => {
      setScore(0);
      resetTarget();
    });

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', () => setTimeout(resize, 250));

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      last = performance.now();
    });

    resize();
    resetTarget();
    drawBackground(0);
    drawTarget();
