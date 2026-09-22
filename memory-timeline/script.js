/* ============================================================
   OUR STORY — Memory Timeline · AUTO
   Album tự chạy theo bài hát: không swipe, không bấm, không dot.
   8 ảnh theo năm · chia ĐỀU thời lượng bài hát · polaroid kết.
   DATA → RENDER → TRANSITION → AUDIO (sync) → PROGRESS
   ============================================================ */

"use strict";

/* ============================================================
   1) DATA — mọi nội dung chỉnh ở đây
   ------------------------------------------------------------
   transition: left | right | push | fade | zoom | dissolve
   mood      : intro | verse | prechorus | chorus | bridge | final | outro
   layout    : "" | split | quote | gilded | keepsake
   size      : "lg" → ảnh phóng to hơn
   QUY TẮC ẢNH: tên file chứa năm (VD 2025.jpg) phải trùng year của
   trang. Mỗi ảnh dùng ĐÚNG 1 lần. Tổng cộng 8 ảnh.
   ============================================================ */

const memories = [
  {
    year: "2022",
    size: "lg", // ảnh phóng to hơn
    title: "Mùa thu mình gặp nhau",
    description: "Không phải một ngày đặc biệt. Chỉ là kể từ đó, mọi ngày thường đều đáng mong chờ.",
    image: "images/2022.jpg",
    transition: "dissolve",
    mood: "intro",
  },
  {
    year: "2023",
    size: "lg", // ảnh phóng to hơn
    title: "Năm thứ nhất",
    description: "Mình học thói quen của nhau như học một bài mới — chậm thôi, nhưng nhớ rất lâu.",
    image: "images/2023.jpg",
    transition: "left",
    mood: "verse",
    layout: "split",
  },
  {
    year: "2024",
    title: "Năm thứ hai",
    description: "Năm mình hiểu rằng yêu không phải lúc nào cũng dễ — nhưng chắc chắn là đáng.",
    image: "images/2024.jpg",
    transition: "push",
    mood: "prechorus",
  },
  {
    year: "2025",
    title: "Năm thứ ba",
    description: "Hai người chẳng quen biết gì, giờ thành một thói quen gọi là “về nhà”.",
    image: "images/2025.jpg",
    transition: "zoom",
    mood: "chorus",
    layout: "gilded",
  },
  {
    year: "2025",
    title: "Vẫn là em",
    description: "Thời gian đổi được nhiều thứ, trừ việc anh nhìn em vẫn thấy ấm áp như ngày đầu.",
    image: "images/2025.1.jpg",
    transition: "left",
    mood: "chorus",
    layout: "split",
  },
  {
    year: "2026",
    title: "Năm thứ tư",
    description: "Bốn năm là không dài, nhưng là đẹp nhất anh từng đi.",
    image: "images/2026.jpg",
    transition: "right",
    mood: "verse",
  },
  {
    year: "2026",
    title: "Bốn năm là để nhớ",
    description: "Còn những năm sau, là để cùng nhau đi tiếp.",
    image: "images/2026.1.jpg",
    transition: "zoom",
    mood: "final",
  },
  {
    year: "2026",
    title: "",
    description: "Và câu hát vẫn chưa hết — còn dài nữa phía trước.",
    image: "images/2026.2.jpg",
    note: "Bốn năm — và những năm sau nữa, vẫn là em",
    transition: "push",
    mood: "final",
    layout: "keepsake",
  },
];

/* ============================================================
   2) AUDIO — trang chia ĐỀU thời lượng bài hát
   Bốn Năm.mp3 (~4:13) ÷ 8 ảnh ≈ 32s/trang. Không cần sửa gì:
   đổi bài hát khác → album tự chia lại đều theo duration mới.
   Trang cuối (keepsake) giữ đến hết bài.
   ============================================================ */

const MUSIC_SRC = "music/Bon Nam.mp3";
const PLACEHOLDER_IMG = "images/placeholder.svg";
const TRANSITION_MS = 950;      // khớp --t-page trong CSS
const TICKER_MS = 7000;         // không có nhạc → tự lật trang mỗi 7s

/* ============================================================
   3) DOM & STATE
   ============================================================ */

const stage = document.getElementById("stage");
const introEl = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");
const musicToggle = document.getElementById("musicToggle");
const progressFill = document.getElementById("progressFill");
const timeNow = document.getElementById("timeNow");
const timeSong = document.getElementById("timeSong");

const TOTAL = memories.length;

let current = -1;
let busy = false;          // đang transition → khoá
let audio = null;
let started = false;

/* Ticker KHÔNG NHẠC: chỉ chạy khi mp3 lỗi/thiếu thật sự.
   Nhạc pause tạm thời → album giữ nguyên trang (đồng bộ khi play lại). */
let tickerId = null;
function tickerStart() {
  tickerStop();
  tickerId = setInterval(() => {
    const nextIdx = (current + 1) % TOTAL;
    goTo(nextIdx, transitionFor(memories[nextIdx], false));
  }, TICKER_MS);
}
function tickerStop() {
  if (tickerId) { clearInterval(tickerId); tickerId = null; }
}

/* ============================================================
   4) RENDER — tạo các page từ DATA
   ============================================================ */

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

/* Fallback khi thiếu ảnh: thay src bằng placeholder, không vỡ layout */
function onImgError(e) {
  const img = e.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = "1";
  img.src = PLACEHOLDER_IMG;
}

/* KHUNG BÁM ẢNH: đo tỉ lệ thật của ảnh → đặt aspect-ratio cho khung,
   để ảnh nằm TRỌN trong khung (không bị cắt).
   Trang keepsake xử lý riêng: ảnh trọn vẹn theo tỉ lệ gốc. */
function fitFrame(img) {
  const photo = img.closest(".photo");
  const page = img.closest(".page");
  if (!photo || !page) return;
  const w = img.naturalWidth, h = img.naturalHeight;
  if (!w || !h) return;
  const r = w / h;                    // >1 ngang, <1 dọc
  const ratio = Math.min(Math.max(r, 0.56), 1.45); // chặn quá dọc/quá ngang
  photo.style.setProperty("--fit", r.toFixed(4));
  if (page.classList.contains("page--keepsake")) {
    photo.style.removeProperty("aspect-ratio");
  } else {
    photo.style.aspectRatio = ratio.toFixed(4);
    if (r < 0.97) photo.classList.add("fit");        // ảnh dọc → khung thu hẹp lại
    if (r > 1.25) photo.classList.add("fit-wide");   // ảnh ngang → khung nở ngang
  }
}

/* Năm trong tên file (nếu có) — dùng để cảnh báo mapping lệch */
function yearIn(s) {
  const m = (s || "").match(/\d{4}/);
  return m ? m[0] : null;
}

function buildPages() {
  const frag = document.createDocumentFragment();
  memories.forEach((m, i) => {
    const page = el("section", `page page--${m.layout || "plain"}`);
    page.classList.add(`mood-${m.mood || "verse"}`);
    if (m.size === "lg") page.classList.add("photo-lg"); // trang ảnh phóng to
    page.dataset.index = i;

    page.style.setProperty("--bg-img", m.image ? `url("${m.image}")` : "none");
    const py = yearIn(m.image), pageY = yearIn(m.year);
    if (py && pageY && py !== pageY) {
      console.warn(`[memory-timeline] Ảnh ${m.image} (${py}) không khớp năm trang "${m.year}" — kiểm tra memories[${i}]`);
    }
    page.style.setProperty("--bg-dim", moodBgDim(m.mood));

    const inner = el("div", "page-inner");

    // Kicker: chỉ năm
    const kicker = el("div", "kicker");
    kicker.appendChild(el("div", "year", m.year));
    inner.appendChild(kicker);

    const photo = el("figure", "photo");
    if (m.note) photo.setAttribute("data-note", m.note); // chú thích polaroid (keepsake)
    const img = el("img");
    img.src = m.image;
    img.alt = m.title || m.description || "";
    img.decoding = "async";
    img.loading = i <= 2 ? "eager" : "lazy";
    img.addEventListener("error", onImgError);
    img.addEventListener("load", () => fitFrame(img));
    if (img.complete && img.naturalWidth) fitFrame(img); // ảnh đã cache
    photo.appendChild(img);
    if (m.layout !== "keepsake") photo.appendChild(el("span", "shutter")); // màn che reveal
    inner.appendChild(photo);

    if (m.title) {
      const caption = el("div", "caption");
      caption.appendChild(el("h2", "title", m.title));
      if (m.description) caption.appendChild(el("p", "desc", m.description));
      inner.appendChild(caption);
    }

    if (m.layout === "keepsake") {
      page.appendChild(el("span", "heart"));
    }

    page.appendChild(inner);
    frag.appendChild(page);
  });
  stage.appendChild(frag);
}

function moodBgDim(mood) {
  switch (mood) {
    case "intro":    return "0.95";
    case "outro":    return "0.95";
    case "chorus":
    case "final":    return "0.8";
    default:         return "0.88";
  }
}

/* ============================================================
   5) TRANSITION ENGINE — nguồn duy nhất: audio.currentTime
   ============================================================ */

function transitionFor(mem, backward) {
  if (backward) return mem.mood === "outro" || mem.mood === "intro" ? "dissolve" : "right";
  return mem.transition || "left";
}

function goTo(index, transition = "left") {
  index = Math.max(0, Math.min(TOTAL - 1, index));
  if (busy || index === current) return;
  busy = true;

  const oldPage = stage.children[current];
  const newPage = stage.children[index];
  const dur = (transition === "dissolve" ? 1200 : TRANSITION_MS);

  // Out-going
  if (oldPage) {
    oldPage.classList.remove("is-active");
    oldPage.classList.add(`exit-${transition}`);
  }
  // In-coming: reset reveal để chạy lại từ đầu (replay khi lật lại)
  newPage.classList.remove("photo-in");
  newPage.classList.add(`enter-${transition}`);
  void newPage.offsetWidth; // force reflow để transition + reveal chắc chắn chạy
  stage.classList.add(`go-${transition}`);
  newPage.classList.add("is-active", "photo-in");
  current = index;

  document.body.classList.toggle(
    "has-bokeh",
    memories[index].mood === "final" || memories[index].mood === "outro"
  );

  const done = () => {
    [...stage.children].forEach((p, i) => {
      p.classList.remove(...[...p.classList].filter((c) => c.startsWith("enter-") || c.startsWith("exit-")));
      if (i !== current) p.classList.remove("is-active");
    });
    stage.classList.remove(`go-${transition}`);
    busy = false;
  };
  setTimeout(done, dur + 60);
}

/* Giây hiện tại → trang: chia ĐỀU duration cho TOTAL */
function pageForTime(t) {
  if (!audio || !isFinite(audio.duration) || audio.duration <= 0) return 0;
  return Math.min(TOTAL - 1, Math.floor(t / (audio.duration / TOTAL)));
}

/* Nhạc chạy đến đâu → album chuyển đến đó (mapping tuyệt đối) */
function syncPageToAudio() {
  if (!audio || audio.paused) return;
  const page = pageForTime(audio.currentTime);
  if (page !== current) {
    goTo(page, transitionFor(memories[page], page < current));
  }
}

/* ============================================================
   6) AUDIO
   ============================================================ */

function setupAudio() {
  audio = new Audio(MUSIC_SRC);
  audio.preload = "auto";
  audio.addEventListener("loadedmetadata", () => {
    timeSong.textContent = fmt(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    updateProgressUI();
    syncPageToAudio();
  });
  audio.addEventListener("ended", () => {
    goTo(TOTAL - 1, "dissolve"); // giữ polaroid đến hết bài
  });
  audio.addEventListener("pause", () => {
    document.body.classList.remove("music-playing");
  });
  audio.addEventListener("play", () => {
    document.body.classList.add("music-playing");
    tickerStop();
    syncPageToAudio();
  });
  audio.addEventListener("error", () => {
    timeSong.textContent = "no audio";
    if (started) tickerStart();   // mp3 lỗi thật sự → vẫn có trải nghiệm
  });
}

function playMusic() {
  if (!audio) setupAudio();
  audio.play().then(() => {
    document.body.classList.add("music-playing");
    tickerStop();
  }).catch(() => {
    // autoplay bị chặn → user bấm ♫ là đủ.
    if (!isFinite(audio.duration)) tickerStart();
  });
}

function fmt(s) {
  if (!isFinite(s)) return "—";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* Thanh progress: CHỈ hiển thị, không kéo */
function updateProgressUI() {
  if (!audio || !isFinite(audio.duration)) return;
  progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  timeNow.textContent = fmt(audio.currentTime);
}

/* ============================================================
   7) MUSIC TOGGLE — nút ♫ duy nhất còn tương tác
   ============================================================ */

musicToggle.addEventListener("click", () => {
  if (!audio) setupAudio();
  if (audio.paused) {
    playMusic();
  } else {
    audio.pause();
  }
});

/* ============================================================
   8) START — intro → album tự chạy
   ============================================================ */

function startExperience() {
  if (started) return;
  started = true;
  introEl.classList.add("is-hidden");
  playMusic();           // lỗi / chặn → audio "error" listener tự bật ticker
  goTo(0, "dissolve");
}
startBtn.addEventListener("click", startExperience);
document.addEventListener("keydown", (e) => {
  if (!started && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    startExperience();
  }
}, { once: true });

/* ============================================================
   9) INIT
   ============================================================ */

buildPages();
// Chuẩn bị page 0 ẩn sẵn (sẽ hiện khi nhấn Bắt đầu)
stage.children[0].classList.add("enter-dissolve");
