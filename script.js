/* ==========================================================================
   DAKSHU — Homepage Cinematic Logic & Glitch Countdown Timer
   ========================================================================== */

// 19 February 2027, 12:00 AM IST (Indian Standard Time, UTC+05:30)
const SITE_UNLOCK_TIMESTAMP = new Date("2027-02-19T00:00:00+05:30").getTime();
 
let isHomepageInitialized = false;
let countdownIntervalId = null;

// True accurate time values (jo background me accurately calculate hoti rahengi)
let trueCountdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
let isGlitchingNumber = false;
let glitchedSecValue = null;
let glitchedMinValue = null;

document.addEventListener("DOMContentLoaded", () => {
  initStarDustCanvas();
  initMouseParallax();
  evaluateSiteUnlockState();
});

/**
 * Checks whether current time reached 19 February 2027
 */
function evaluateSiteUnlockState() {
  const now = Date.now();
  const isUnlocked = now >= SITE_UNLOCK_TIMESTAMP;

  if (isUnlocked) {
    revealFullHomepage();
  } else {
    document.documentElement.classList.add("prelaunch-locked");
    document.body.classList.add("prelaunch-locked");
    startPrelaunchCountdown();
    startGlitchEngine(); // Numbers ko random jump karwane wala engine
  }
}

/**
 * Live Running Countdown Timer (Tick har second accurate chalega)
 */
function startPrelaunchCountdown() {
  const daysEl = document.getElementById("timerDays");
  const hoursEl = document.getElementById("timerHours");
  const minsEl = document.getElementById("timerMinutes");
  const secsEl = document.getElementById("timerSeconds");

  function calculateTime() {
    // Exact real-time (NO normalization)
    const now = Date.now();
    const distance = SITE_UNLOCK_TIMESTAMP - now;

    if (distance <= 0) {
      if (countdownIntervalId) clearInterval(countdownIntervalId);
      revealFullHomepage();
      return;
    }

    trueCountdown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
    trueCountdown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    trueCountdown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    trueCountdown.seconds = Math.floor((distance % (1000 * 60)) / 1000);

    renderTimerDisplay();
  }

  function renderTimerDisplay() {
    if (daysEl) daysEl.textContent = String(trueCountdown.days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(trueCountdown.hours).padStart(2, "0");

    // Agar glitch active hai toh glitched number dikhao, warna original running number
    if (minsEl) {
      minsEl.textContent = (isGlitchingNumber && glitchedMinValue !== null)
        ? String(glitchedMinValue).padStart(2, "0")
        : String(trueCountdown.minutes).padStart(2, "0");
    }

    if (secsEl) {
      secsEl.textContent = (isGlitchingNumber && glitchedSecValue !== null)
        ? String(glitchedSecValue).padStart(2, "0")
        : String(trueCountdown.seconds).padStart(2, "0");
    }
  }

  calculateTime();
  countdownIntervalId = setInterval(calculateTime, 1000);

  // Display renderer (smooth UI update)
  setInterval(renderTimerDisplay, 60);
}

/**
 * Random Number Glitch Engine
 * Har 2.5 se 5 second baad number achank jump karega (e.g. 25 -> 29 -> 24)
 */
function startGlitchEngine() {
  const timerContainer = document.getElementById("prelaunchCountdown");
  const secsEl = document.getElementById("timerSeconds");

  function triggerGlitch() {
    const nextGlitchDelay = Math.floor(Math.random() * 3000) + 2500; // 2.5s se 5s me trigger

    setTimeout(() => {
      isGlitchingNumber = true;

      // Random fake number jump (jaise 25 se achank 29, 38, etc.)
      const randomOffset = Math.floor(Math.random() * 12) + 2;
      glitchedSecValue = (trueCountdown.seconds + randomOffset) % 60;

      // Kabhi kabhi minute bhi halka sa flicker kare
      if (Math.random() > 0.6) {
        glitchedMinValue = (trueCountdown.minutes + 3) % 60;
      }

      if (timerContainer) timerContainer.classList.add("is-glitching");
      if (secsEl) secsEl.classList.add("num-glitch");

      // Short glitch pulse (180ms se 350ms ke baad wapas normal real running time pe aa jayega)
      const glitchDuration = Math.floor(Math.random() * 170) + 180;
      
      setTimeout(() => {
        isGlitchingNumber = false;
        glitchedSecValue = null;
        glitchedMinValue = null;

        if (timerContainer) timerContainer.classList.remove("is-glitching");
        if (secsEl) secsEl.classList.remove("num-glitch");

        triggerGlitch(); // Agle glitch ke liye schedule
      }, glitchDuration);

    }, nextGlitchDelay);
  }

  triggerGlitch();
}

/**
 * Automatically unlocks the full homepage
 */
function revealFullHomepage() {
  if (countdownIntervalId) {
    clearInterval(countdownIntervalId);
    countdownIntervalId = null;
  }

  document.documentElement.classList.remove("prelaunch-locked");
  document.body.classList.remove("prelaunch-locked");

  if (!isHomepageInitialized) {
    isHomepageInitialized = true;
    renderConnectedTimeline();
    updateJourneyProgress();
    initIntersectionReveal();
    initTimelineSpineScroll();
    initSmoothJourneyScroll();
  }
}

/**
 * Ambient cosmic stardust canvas
 */
function initStarDustCanvas() {
  const canvas = document.getElementById("starsCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const starCount = window.innerWidth <= 768 ? 25 : 60;
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      velocity: Math.random() * 0.25 + 0.08,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      pulseVal: Math.random() * Math.PI
    });
  }

  function renderStars() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach((star) => {
      star.y -= star.velocity;
      if (star.y < 0) {
        star.y = height;
        star.x = Math.random() * width;
      }

      star.pulseVal += star.pulseSpeed;
      const currentAlpha = star.alpha * (0.6 + 0.4 * Math.sin(star.pulseVal));

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 190, 110, ${currentAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(255, 107, 74, 0.7)";
      ctx.fill();
    });

    requestAnimationFrame(renderStars);
  }

  renderStars();
}

/**
 * Parallax for orbs & hero stage
 */
function initMouseParallax() {
  if (window.innerWidth <= 768) return;

  const content = document.getElementById("heroParallaxContent");
  const orb1 = document.getElementById("parallaxOrb1");
  const orb2 = document.getElementById("parallaxOrb2");
  const orb3 = document.getElementById("parallaxOrb3");

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener("mousemove", (e) => {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    mouseX = (e.clientX - halfWidth) / halfWidth;
    mouseY = (e.clientY - halfHeight) / halfHeight;
  }, { passive: true });

  function renderParallax() {
    currentX += (mouseX - currentX) * 0.06;
    currentY += (mouseY - currentY) * 0.06;

    if (content) content.style.transform = `translate3d(${currentX * 8}px, ${currentY * 8}px, 0)`;
    if (orb1) orb1.style.transform = `translate3d(calc(-50% + ${currentX * -14}px), ${currentY * -14}px, 0)`;
    if (orb2) orb2.style.transform = `translate3d(${currentX * 12}px, ${currentY * 12}px, 0)`;
    if (orb3) orb3.style.transform = `translate3d(${currentX * -10}px, ${currentY * -10}px, 0)`;

    requestAnimationFrame(renderParallax);
  }

  requestAnimationFrame(renderParallax);
}

/**
 * Timeline progress status
 */
function updateJourneyProgress() {
  const headlineEl = document.getElementById("progressStatusText");
  const fillEl = document.getElementById("progressBarFill");
  const hintEl = document.getElementById("progressHintText");
  const pillEl = document.getElementById("progressPercentagePill");

  if (!headlineEl || !fillEl || !hintEl || !pillEl || typeof JOURNEY_DAYS === "undefined") return;

  const today = new Date();
  const firstDay = new Date(JOURNEY_DAYS[0].dateStr + "T00:00:00");
  const finalDay = new Date(JOURNEY_DAYS[JOURNEY_DAYS.length - 1].dateStr + "T00:00:00");

  let percentage = 0;
  let headline = "";
  let hint = "";

  if (today < firstDay) {
    headline = "THE JOURNEY BEGINS SOON";
    const daysLeft = Math.ceil((firstDay - today) / (1000 * 60 * 60 * 24));
    hint = `Sunset begins in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} on 19 February 2027 ❤️`;
    percentage = 0;
  } else if (today > finalDay) {
    headline = "THE JOURNEY IS COMPLETE ❤️";
    hint = "Dakshu's special birthday journey is forever unlocked.";
    percentage = 100;
  } else {
    let currentDayNumber = 0;
    JOURNEY_DAYS.forEach((item) => {
      if (typeof isDateUnlocked === "function" && isDateUnlocked(item.dateStr)) {
        currentDayNumber = item.day;
      }
    });

    percentage = currentDayNumber * 10;
    headline = `DAY ${currentDayNumber} OF 10`;
    hint = `${percentage}% of Dakshu's sunset story has been revealed.`;
  }

  setTimeout(() => {
    fillEl.style.width = `${percentage}%`;
  }, 400);

  headlineEl.textContent = headline;
  hintEl.textContent = hint;
  pillEl.textContent = `${percentage}%`;
}

function renderConnectedTimeline() {
  const container = document.getElementById("timelineCardsContainer");
  if (!container || typeof JOURNEY_DAYS === "undefined") return;
  container.innerHTML = "";
  const today = new Date();
  const searchParams = window.location.search;

  JOURNEY_DAYS.forEach((item, index) => {
    const isUnlocked = typeof isDateUnlocked === "function" ? isDateUnlocked(item.dateStr) : false;
    const isToday = typeof isDateToday === "function" ? isDateToday(item.dateStr) : false;
    const targetDate = new Date(item.dateStr + "T00:00:00");
    const isCompleted = isUnlocked && !isToday && today > targetDate;

    const displayTitle = typeof getDayTitle === "function" ? getDayTitle(item) : `Day ${item.day}`;
    const displayIcon = typeof getDayIcon === "function" ? getDayIcon(item) : "✨";
    const isLeft = index % 2 === 0;

    const row = document.createElement("div");
    row.className = `timeline-row ${isLeft ? 'left-aligned' : 'right-aligned'} ${isToday ? 'is-current' : ''}`;

    const node = document.createElement("div");
    node.className = "timeline-center-node";
    node.setAttribute("aria-hidden", "true");
    row.appendChild(node);

    const wrapper = document.createElement("div");
    wrapper.className = "timeline-card-wrapper";
    wrapper.dataset.revealIndex = index;

    const card = document.createElement(isUnlocked ? "a" : "div");
    card.className = `timeline-journey-card ${isUnlocked ? 'is-unlocked' : 'is-locked'} ${isToday ? 'is-current' : ''} ${item.day === 1 ? 'is-day-one' : ''}`;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Day 0${item.day}: ${displayTitle}`);

    if (isUnlocked) {
      card.href = searchParams ? `${item.file}${searchParams}` : item.file;
    } else {
      card.addEventListener("click", () => typeof showLockModal === "function" && showLockModal(item));
    }

    let statusBadgeHtml = isUnlocked
      ? (isToday ? `<span class="card-status-tag tag-current">CURRENT ✨</span>` : (isCompleted ? `<span class="card-status-tag tag-completed">✓ COMPLETED</span>` : `<span class="card-status-tag tag-unlocked">UNLOCKED</span>`))
      : `<span class="card-status-tag tag-locked">🔒 LOCKED &bull; ${item.dateDisplay}</span>`;

    let arrowIndicatorHtml = isUnlocked ? `<span class="card-arrow-cue">OPEN →</span>` : `<span class="card-arrow-cue">🔒</span>`;
    const starterBadgeHtml = item.day === 1 ? `<span class="day-starter-badge">THE JOURNEY STARTS HERE</span>` : "";

    card.innerHTML = `
      ${starterBadgeHtml}
      <div class="card-header-line">
        <span class="card-numeral-pill">DAY 0${item.day}</span>
        <span class="card-emblem-icon">${displayIcon}</span>
      </div>
      <div class="card-center-body">
        <h3 class="card-story-title">${displayTitle}</h3>
        <span class="card-date-badge">${item.dateDisplay}</span>
      </div>
      <div class="card-status-footer">
        ${statusBadgeHtml}
        ${arrowIndicatorHtml}
      </div>
    `;

    wrapper.appendChild(card);
    row.appendChild(wrapper);
    container.appendChild(row);
  });
}

function initIntersectionReveal() {
  const cards = document.querySelectorAll(".timeline-card-wrapper");
  if (!cards.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach((card) => observer.observe(card));
}

function initTimelineSpineScroll() {
  const timeline = document.getElementById("journeyTimeline");
  const glow = document.getElementById("timelineSpineGlow");
  if (!timeline || !glow) return;
  window.addEventListener("scroll", () => {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (rect.top < windowHeight && rect.bottom > 0) {
      const visibleScrolled = windowHeight - rect.top;
      const percentage = Math.min(Math.max((visibleScrolled / rect.height) * 100, 0), 100);
      glow.style.height = `${percentage}%`;
    }
  }, { passive: true });
}

function initSmoothJourneyScroll() {
  const startBtn = document.getElementById("startJourneyBtn");
  if (startBtn) {
    startBtn.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" });
    });
  }
}

/* ==========================================================================
   DAKSHU — INTERACTIVE EXPERIENCES (Easter Eggs, 3D Tilt, Particle Trails)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initCursorTrail();
  initCountdownTilt();
  initLogoEasterEgg();
  initManualTimerGlitch();
});

/**
 * 1. Floating Golden Hearts & Sunset Sparkles on Mouse Move / Touch
 */
function initCursorTrail() {
  const particles = ["🤎", "✨", "✦", "🧡", "🌅"];
  let lastSpawnTime = 0;

  function spawnParticle(x, y) {
    const now = Date.now();
    if (now - lastSpawnTime < 60) return; // limit count for performance
    lastSpawnTime = now;

    const el = document.createElement("span");
    el.className = "interactive-trail-particle";
    el.textContent = particles[Math.floor(Math.random() * particles.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    // Random drift physics
    el.style.setProperty("--rand-x", (Math.random() * 60 - 30).toFixed(0));
    el.style.setProperty("--rand-rot", `${(Math.random() * 40 - 20).toFixed(0)}deg`);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }

  window.addEventListener("mousemove", (e) => spawnParticle(e.clientX, e.clientY), { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      spawnParticle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
}

/**
 * 2. 3D Tilt Effect on Countdown Box (Mouse Tracking)
 */
function initCountdownTilt() {
  if (window.innerWidth <= 768) return; // Mobile par off rakhein clean feel ke liye

  const card = document.getElementById("prelaunchCountdown");
  if (!card) return;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg tilt
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
}

/**
 * 3. Logo Tap Secret Whispers (Easter Egg for Dakshu)
 */
function initLogoEasterEgg() {
  const logoWrapper = document.querySelector(".prelaunch-logo-wrapper");
  if (!logoWrapper) return;

  const whispers = [
    "Thoda sabr Dakshu, surprise bohot pyara hai 🤫💛",
    "Countdown dekh kar smile aayi na? ✨",
    "19 Feb ko kuch bohot magical unfold hoga... 🌅",
    "Har ek second aapke liye count ho raha hai ❤️",
    "Dakshu, is journey ka har ek din special hai! ✦",
    "Patience... The sunset story is loading 🌅✨"
  ];

  let whisperIndex = 0;
  let toastTimeout = null;

  // Create toast container
  const toast = document.createElement("div");
  toast.className = "secret-whisper-toast";
  toast.innerHTML = `<span class="toast-sparkle">✦</span> <span id="whisperMsg"></span> <span class="toast-sparkle">✦</span>`;
  document.body.appendChild(toast);

  logoWrapper.addEventListener("click", () => {
    // Mobile haptic vibration feedback
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);

    const msgEl = document.getElementById("whisperMsg");
    msgEl.textContent = whispers[whisperIndex % whispers.length];
    whisperIndex++;

    toast.classList.add("active");

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("active");
    }, 3200);
  });
}

/**
 * 4. Tap/Click to Force Glitch Timer Instantly
 */
function initManualTimerGlitch() {
  const timer = document.getElementById("prelaunchCountdown");
  const secsEl = document.getElementById("timerSeconds");
  if (!timer) return;

  timer.addEventListener("click", () => {
    // Haptic buzz
    if (navigator.vibrate) navigator.vibrate(50);

    // Instant glitch burst
    timer.classList.add("box-glitching");
    if (secsEl) {
      const origText = secsEl.textContent;
      secsEl.textContent = String(Math.floor(Math.random() * 59)).padStart(2, "0");
      secsEl.classList.add("glitch-active");

      setTimeout(() => {
        timer.classList.remove("box-glitching");
        secsEl.classList.remove("glitch-active");
        secsEl.textContent = origText;
      }, 300);
    }
  });
}

/* ==========================================================================
   DAKSHU — ADVANCED INTERACTION ENGINE (Audio Chimes + Heartbeat + Stars)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initCelestialChimes();
  initHeartbeatHold();
  initShootingStars();
});

// 1. CELESTIAL MUSIC BOX AUDIO (Web Audio API - No MP3 files needed)
let audioCtx = null;
const scaleFrequencies = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // Pentatonic romantic scale

function playChime(freqIndex = null) {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const freq = freqIndex !== null 
      ? scaleFrequencies[freqIndex % scaleFrequencies.length] 
      : scaleFrequencies[Math.floor(Math.random() * scaleFrequencies.length)];

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = "sine"; // Pure music box bell tone
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Soft chime envelope
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.22, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 1.25);
  } catch (err) {
    // Audio context silent catch if browser blocks
  }
}

function initCelestialChimes() {
  // Har screen click / touch par pyara music-box bell chime bajega
  window.addEventListener("pointerdown", () => playChime(), { passive: true });
}

// 2. HOLD FOR HEARTBEAT INTERACTION
function initHeartbeatHold() {
  const btn = document.getElementById("heartbeatBtn");
  const fill = document.getElementById("holdProgressFill");
  const label = document.getElementById("holdBtnText");
  if (!btn || !fill || !label) return;

  let holdTimer = null;
  let progress = 0;
  let hapticInterval = null;

  function startHold(e) {
    e.preventDefault();
    progress = 0;
    label.textContent = "Listening to heart...";
    document.body.classList.add("heartbeat-screen-pulse");

    // Real-time Heartbeat haptic loop (Lub-Dub sound & vibration)
    if (navigator.vibrate) navigator.vibrate([60, 80, 60]);
    playChime(2);

    hapticInterval = setInterval(() => {
      if (navigator.vibrate) navigator.vibrate([50, 70, 50]);
      playChime(3);
    }, 700);

    // Charge progress to 100% in 2 seconds
    holdTimer = setInterval(() => {
      progress += 2.5;
      fill.style.width = `${progress}%`;

      if (progress >= 100) {
        completeHeartbeat();
      }
    }, 50);
  }

  function cancelHold() {
    clearInterval(holdTimer);
    clearInterval(hapticInterval);
    document.body.classList.remove("heartbeat-screen-pulse");

    if (progress < 100) {
      fill.style.width = "0%";
      label.textContent = "Hold for Heartbeat";
    }
  }

  function completeHeartbeat() {
    clearInterval(holdTimer);
    clearInterval(hapticInterval);
    document.body.classList.remove("heartbeat-screen-pulse");

    if (navigator.vibrate) navigator.vibrate([100, 50, 150, 50, 200]);

    // High celebration chimes
    playChime(4);
    setTimeout(() => playChime(5), 200);

    label.textContent = "Pulse Sent to Dakshu! 💛";
    spawnConfettiBurst();

    setTimeout(() => {
      fill.style.width = "0%";
      label.textContent = "Hold for Heartbeat";
    }, 3500);
  }

  btn.addEventListener("mousedown", startHold);
  btn.addEventListener("touchstart", startHold, { passive: false });

  btn.addEventListener("mouseup", cancelHold);
  btn.addEventListener("mouseleave", cancelHold);
  btn.addEventListener("touchend", cancelHold);
}

// 3. GOLDEN HEART CONFETTI BURST (Jab Heartbeat complete ho)
function spawnConfettiBurst() {
  const emojis = ["💛", "✨", "🧡", "💖", "🌅"];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2 + 100;

  for (let i = 0; i < 35; i++) {
    const el = document.createElement("span");
    el.className = "interactive-trail-particle";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = `${centerX}px`;
    el.style.top = `${centerY}px`;

    const randomX = (Math.random() - 0.5) * 350;
    const randomRot = Math.random() * 360;

    el.style.setProperty("--rand-x", randomX.toFixed(0));
    el.style.setProperty("--rand-rot", `${randomRot.toFixed(0)}deg`);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
}

// 4. SHOOTING STARS ON DOUBLE CLICK / TAP
function initShootingStars() {
  function triggerShootingStar(x, y) {
    const star = document.createElement("div");
    star.className = "shooting-star";
    star.style.left = `${x || (window.innerWidth - 100)}px`;
    star.style.top = `${y || Math.random() * 250 + 50}px`;

    document.body.appendChild(star);
    playChime(5);
    setTimeout(() => star.remove(), 1000);
  }

  // Screen par kahin bhi double-click karein to shooting star aayega
  window.addEventListener("dblclick", (e) => triggerShootingStar(e.clientX, e.clientY));

  // Automatic random shooting star every 12 to 20 seconds
  setInterval(() => {
    triggerShootingStar(window.innerWidth - Math.random() * 200, Math.random() * 200);
  }, 15000);
}