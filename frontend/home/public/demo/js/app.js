/**
 * Undangan Pernikahan Digital - Interaktivitas & Logika
 * Raden Arya Pratama & Adinda Sarah Salsabila
 */

// Konfigurasi Tanggal Pernikahan (Format: YYYY, MM (0-indexed), DD, HH, MM)
// Default: 24 Oktober 2026, 08:00 WIB
const WEDDING_DATE = new Date(2026, 9, 24, 8, 0, 0);

// Audio State
let isPlaying = false;
let bgAudio = null;
let webAudioCtx = null;
let webAudioOscillators = [];

// Sample data buku tamu awal jika localStorage masih kosong
const DEFAULT_WISHES = [
  {
    id: 1,
    name: "Dimas Anggara & Keluarga",
    status: "hadir",
    guests: 2,
    message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Selamat menempuh hidup baru Arya dan Sarah! Semoga langgeng dan sakinah mawaddah warahmah.",
    date: "1 jam yang lalu"
  },
  {
    id: 2,
    name: "dr. Nabila Putri, Sp.A",
    status: "hadir",
    guests: 1,
    message: "MasyaAllah cantik banget Sarah! Selamat berbahagia buat kedua mempelai. Lancar sampai hari H yaa sayang!",
    date: "3 jam yang lalu"
  },
  {
    id: 3,
    name: "Reza Fahlevi (Alumni Teknik '18)",
    status: "ragu",
    guests: 1,
    message: "Selamat brader Arya! Semoga dilancarkan semua prosesinya. InsyaAllah diusahakan hadir bro.",
    date: "5 jam yang lalu"
  },
  {
    id: 4,
    name: "Tante Rina & Om Hendra",
    status: "hadir",
    guests: 2,
    message: "Selamat untuk ananda berdua dan seluruh keluarga besar. Semoga rukun selalu hingga maut memisahkan.",
    date: "1 hari yang lalu"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initGuestName();
  initAudio();
  initCountdown();
  initRSVP();
  initCopyClipboard();
  initPetalsEffect();
  initNavigationScroll();
  initGoogleCalendarButton();
  
  // Inisialisasi AOS jika tersedia
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 850,
      easing: 'ease-out-cubic',
      once: false,
      offset: 50
    });
  }
});

/**
 * 1. Ambil Nama Tamu dari URL Parameter (?to=Nama+Tamu)
 */
function initGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('u') || urlParams.get('nama');
  const guestDisplay = document.getElementById('guest-name');
  
  if (guestDisplay) {
    if (guestParam) {
      guestDisplay.textContent = decodeURIComponent(guestParam);
    } else {
      guestDisplay.textContent = "Tamu Undangan";
    }
  }

  // Isi juga input nama pada form RSVP jika ada parameter
  const rsvpNameInput = document.getElementById('rsvp-name');
  if (rsvpNameInput && guestParam) {
    rsvpNameInput.value = decodeURIComponent(guestParam);
  }
}

/**
 * 2. Background Audio & Web Audio Synthesizer Fallback
 */
function initAudio() {
  // Audio element
  bgAudio = document.getElementById('bg-music');
  const audioToggleBtn = document.getElementById('audio-toggle');
  const vinylIcon = document.getElementById('vinyl-disc');
  const soundBars = document.querySelectorAll('.sound-bar');

  // Trigger Buka Undangan
  const openBtn = document.getElementById('btn-open-invitation');
  const coverGate = document.getElementById('cover-gate');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      // 1. Jalankan audio
      playAudio();
      
      // 2. Transisi pembuka cover
      if (coverGate) {
        coverGate.classList.add('transition-all', 'duration-1000', '-translate-y-full', 'opacity-0', 'pointer-events-none');
      }
      
      // 3. Scroll halus ke konten utama
      setTimeout(() => {
        document.body.classList.remove('overflow-hidden');
        const mainSection = document.getElementById('main-content');
        if (mainSection) {
          mainSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Refresh AOS setelah cover terbuka
        if (typeof AOS !== 'undefined') {
          AOS.refresh();
        }
      }, 500);

      // 4. Tampilkan floating bar navigasi & musik
      const floatingDock = document.getElementById('floating-dock');
      if (floatingDock) {
        floatingDock.classList.remove('hidden');
        setTimeout(() => {
          floatingDock.classList.remove('opacity-0', 'translate-y-10');
        }, 100);
      }
    });
  }

  // Toggle button pada floating controller
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }
}

function playAudio() {
  if (bgAudio) {
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updateAudioUI(true);
        })
        .catch(() => {
          // Jika URL audio gagal, gunakan soft chord ambient Web Audio API
          playAmbientSynth();
          updateAudioUI(true);
        });
    }
  } else {
    playAmbientSynth();
    updateAudioUI(true);
  }
}

function pauseAudio() {
  if (bgAudio) {
    bgAudio.pause();
  }
  stopAmbientSynth();
  updateAudioUI(false);
}

function updateAudioUI(playing) {
  isPlaying = playing;
  const vinylIcon = document.getElementById('vinyl-disc');
  const soundBars = document.querySelectorAll('.sound-bar');
  const audioIcon = document.getElementById('audio-icon');

  if (vinylIcon) {
    if (playing) {
      vinylIcon.classList.remove('paused');
    } else {
      vinylIcon.classList.add('paused');
    }
  }

  soundBars.forEach(bar => {
    if (playing) {
      bar.classList.remove('sound-bar-paused');
    } else {
      bar.classList.add('sound-bar-paused');
    }
  });

  if (audioIcon) {
    if (playing) {
      audioIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
    } else {
      audioIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-200" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
    }
  }
}

/**
 * Web Audio API Harmonic Chords (Cadangan offline yang sangat merdu & lembut)
 */
function playAmbientSynth() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!webAudioCtx) {
      webAudioCtx = new AudioContext();
    }
    if (webAudioCtx.state === 'suspended') {
      webAudioCtx.resume();
    }

    stopAmbientSynth();

    // Harmoni nada romantic pad: Cmaj9 chord (C3, G3, B3, E4, D5)
    const freqs = [130.81, 196.00, 246.94, 329.63, 587.33];
    webAudioOscillators = freqs.map(freq => {
      const osc = webAudioCtx.createOscillator();
      const gain = webAudioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, webAudioCtx.currentTime);

      // Volume sangat lembut dan hangat
      gain.gain.setValueAtTime(0.012, webAudioCtx.currentTime);

      osc.connect(gain);
      gain.connect(webAudioCtx.destination);
      osc.start();

      return { osc, gain };
    });
  } catch (e) {
    console.warn("Ambient audio context not supported", e);
  }
}

function stopAmbientSynth() {
  if (webAudioOscillators.length > 0) {
    webAudioOscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, webAudioCtx.currentTime + 0.5);
        setTimeout(() => osc.stop(), 500);
      } catch (e) {}
    });
    webAudioOscillators = [];
  }
}

/**
 * 3. Countdown Timer Live (Hari, Jam, Menit, Detik)
 */
function initCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function update() {
    const now = new Date().getTime();
    const distance = WEDDING_DATE.getTime() - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/**
 * 4. Tombol Tambahkan ke Google Calendar
 */
function initGoogleCalendarButton() {
  const calBtn = document.getElementById('btn-add-calendar');
  if (!calBtn) return;

  calBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const title = encodeURIComponent("Pernikahan Raden Arya & Adinda Sarah");
    const details = encodeURIComponent("Akad Nikah (08:00 - 10:00 WIB) & Resepsi (11:00 - 14:00 WIB). Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.");
    const location = encodeURIComponent("Grand Ballroom Hotel Mulia Senayan, Jakarta Pusat");
    
    // 24 Oktober 2026 08:00 - 14:00 WIB (UTC+7 -> UTC: 01:00 - 07:00)
    const startTime = "20261024T010000Z";
    const endTime = "20261024T070000Z";
    
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
    window.open(googleCalUrl, '_blank');
  });
}

/**
 * 5. RSVP & Buku Tamu (LocalStorage + Rendering Real-time)
 */
function initRSVP() {
  const form = document.getElementById('rsvp-form');
  const wishesListContainer = document.getElementById('wishes-list');
  const countHadirEl = document.getElementById('count-hadir');

  // Muat dari localStorage atau gunakan data default
  let savedWishes = [];
  try {
    const raw = localStorage.getItem('wedding_rsvps');
    if (raw) {
      savedWishes = JSON.parse(raw);
    } else {
      savedWishes = [...DEFAULT_WISHES];
      localStorage.setItem('wedding_rsvps', JSON.stringify(savedWishes));
    }
  } catch (e) {
    savedWishes = [...DEFAULT_WISHES];
  }

  function renderWishes() {
    if (!wishesListContainer) return;

    if (savedWishes.length === 0) {
      wishesListContainer.innerHTML = `
        <div class="text-center py-8 text-taupe-500 font-serif-luxury italic text-lg">
          Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
        </div>
      `;
      return;
    }

    wishesListContainer.innerHTML = savedWishes.map(item => {
      let badgeHtml = '';
      if (item.status === 'hadir') {
        badgeHtml = `<span class="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hadir (${item.guests || 1} orang)
        </span>`;
      } else if (item.status === 'tidak_hadir') {
        badgeHtml = `<span class="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Berhalangan
        </span>`;
      } else {
        badgeHtml = `<span class="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Masih Ragu
        </span>`;
      }

      // Initial Avatar
      const initial = item.name.trim().charAt(0).toUpperCase() || 'T';

      return `
        <div class="p-4 rounded-2xl bg-white/70 border border-amber-200/50 shadow-sm transition hover:shadow-md">
          <div class="flex items-start justify-between gap-3 mb-2">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 text-taupe-900 font-bold flex items-center justify-center text-sm shadow-inner">
                ${initial}
              </div>
              <div>
                <h4 class="font-bold text-taupe-900 text-sm tracking-wide leading-tight">${escapeHtml(item.name)}</h4>
                <span class="text-[11px] text-taupe-500">${escapeHtml(item.date || 'Baru saja')}</span>
              </div>
            </div>
            <div>
              ${badgeHtml}
            </div>
          </div>
          <p class="text-xs sm:text-sm text-taupe-700 leading-relaxed font-sans pl-13 mt-1 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/60">
            "${escapeHtml(item.message)}"
          </p>
        </div>
      `;
    }).join('');

    // Update Counter Kehadiran
    if (countHadirEl) {
      const totalHadir = savedWishes
        .filter(w => w.status === 'hadir')
        .reduce((sum, w) => sum + (parseInt(w.guests, 10) || 1), 0);
      countHadirEl.textContent = `${totalHadir} Orang`;
    }
  }

  renderWishes();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvp-name')?.value.trim();
      const status = document.querySelector('input[name="rsvp-attendance"]:checked')?.value || 'hadir';
      const guests = parseInt(document.getElementById('rsvp-guests')?.value, 10) || 1;
      const message = document.getElementById('rsvp-message')?.value.trim();

      if (!name || !message) {
        showToast("Mohon lengkapi nama dan doa restu Anda.", "warning");
        return;
      }

      const newEntry = {
        id: Date.now(),
        name: name,
        status: status,
        guests: status === 'hadir' ? guests : 0,
        message: message,
        date: "Baru saja"
      };

      savedWishes.unshift(newEntry);
      try {
        localStorage.setItem('wedding_rsvps', JSON.stringify(savedWishes));
      } catch (err) {}

      renderWishes();
      form.reset();

      showToast("Terima kasih! Konfirmasi & doa restu Anda telah tersimpan.", "success");

      // Scroll sedikit ke daftar ucapan
      wishesListContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
}

/**
 * 6. Salin Nomor Rekening / E-Wallet & Alamat
 */
function initCopyClipboard() {
  const copyButtons = document.querySelectorAll('[data-copy]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetText = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Nomor';

      if (!targetText) return;

      navigator.clipboard.writeText(targetText).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span class="text-emerald-300 font-semibold">Tersalin!</span>
        `;

        showToast(`${label} berhasil disalin ke clipboard!`, "success");

        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2200);
      }).catch(err => {
        // Fallback copy
        fallbackCopyTextToClipboard(targetText);
        showToast(`${label} berhasil disalin!`, "success");
      });
    });
  });
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {}
  document.body.removeChild(textArea);
}

/**
 * 7. Toast Notification Utility
 */
function showToast(message, type = "success") {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  if (toastIcon) {
    if (type === 'success') {
      toastIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    } else {
      toastIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    }
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * 8. Efek Kelopak Bunga Emas / Mawar Gugur (Canvas 60fps)
 */
function initPetalsEffect() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petalsCount = Math.min(24, Math.floor(width / 35));
  const petals = [];

  const colors = [
    'rgba(212, 175, 55, 0.45)',  // Emas murni
    'rgba(243, 229, 171, 0.40)', // Champagne muda
    'rgba(197, 160, 89, 0.35)',  // Warm taupe gold
    'rgba(248, 237, 227, 0.30)'  // Soft cream
  ];

  for (let i = 0; i < petalsCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 9 + 6,
      speedX: Math.random() * 1.2 - 0.6,
      speedY: Math.random() * 1.3 + 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 1.5 - 0.75,
      color: colors[Math.floor(Math.random() * colors.length)],
      sway: Math.random() * 2 * Math.PI,
      swaySpeed: Math.random() * 0.02 + 0.01
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    // Bentuk kelopak bunga organik
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(p.size / 2, -p.size, p.size, -p.size / 2, 0, p.size);
    ctx.bezierCurveTo(-p.size, -p.size / 2, -p.size / 2, -p.size, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.sway += p.swaySpeed;
      p.x += p.speedX + Math.sin(p.sway) * 0.7;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;

      drawPetal(p);
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/**
 * 9. Active Link pada Bottom Navigation Dock
 */
function initNavigationScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-dock-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-amber-400', 'scale-110');
      link.classList.add('text-taupe-300');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-amber-400', 'scale-110');
        link.classList.remove('text-taupe-300');
      }
    });
  });
}

function escapeHtml(string) {
  if (!string) return '';
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}
