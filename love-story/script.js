/*
  STORY DATA
  ----------
  Edit this array to change the story. `start` and `end` are seconds in final.mp3.
  `image` accepts an image path, and `secondImage` is used by the montage layout.
*/
const scenes = [
  { type: 'opening', start: 0, end: 11, transition: 'crossfade', image: 'images/child.jpg', title: 'BỐN NĂM', subtitle: 'câu chuyện nhỏ của chúng mình', text: 'một cuốn phim về chúng mình' },
  { type: 'photo', start: 11, end: 28, transition: 'slide-left', image: 'images/2022.jpg', eyebrow: '2022', title: 'NHỮNG NGÀY ĐẦU', text: 'Ngày ấy, mình chẳng biết câu chuyện này sẽ đi xa đến vậy.' },
  { type: 'text', start: 28, end: 43, transition: 'crossfade', title: 'Có những ngày<br>chẳng có gì đặc biệt...', text: 'nhưng giờ nghĩ lại, lại là những ngày anh nhớ nhất.' },
  { type: 'photo', start: 43, end: 61, transition: 'zoom-slide', image: 'images/2023.jpg', eyebrow: '2023', title: 'NHỮNG KÝ ỨC<br>ĐẦU TIÊN', text: 'Một bức hình, một nụ cười, rồi thành cả một khoảng trời.' },
  { type: 'polaroid', start: 61, end: 77, transition: 'page-turn', image: 'images/2024.jpg', date: '2024', title: 'GIỮ LẠI<br>KHOẢNH KHẮC NÀY', text: 'vì những điều bé nhỏ nhất, hóa ra lại ở mãi trong tim.' },
  { type: 'text', start: 77, end: 91, transition: 'slide-up', title: 'Và rồi<br>anh nhận ra...', text: 'những điều đẹp nhất đều có hình dáng của em.' },
  { type: 'photo', start: 91, end: 109, transition: 'push', image: 'images/2025.jpg', eyebrow: '2025', title: 'GẦN NHAU<br>HƠN', text: 'Từ những câu chuyện thường ngày, mình dần thành thói quen của nhau.' },
  { type: 'photo', start: 109, end: 125, transition: 'slide-right', image: 'images/2025.1.jpg', eyebrow: '2025', title: 'MỌI ĐIỀU<br>ĐỀU ĐẸP', text: 'Có em, cả những ngày tối cũng bỗng trở nên sáng hơn.' },
  { type: 'text', start: 125, end: 139, transition: 'zoom', title: '“Có em ở đây,<br>mọi điều đều đủ đầy.”', text: '— câu hát anh luôn muốn dành cho em.' },
  { type: 'photo', start: 139, end: 158, transition: 'zoom-through', image: 'images/2026.jpg', eyebrow: '2026', title: 'NHỮNG NGÀY<br>MÌNH CHỌN', text: 'Không chỉ là những ngày thật vui — mà là những ngày mình đã chọn ở bên nhau.' },
  { type: 'montage', start: 158, end: 173, transition: 'parallax', image: 'images/2026.jpg', secondImage: 'images/2026.1.jpg', eyebrow: '2026', title: 'CHÚNG MÌNH,<br>TRONG TỪNG MẢNH KÝ ỨC', text: 'Từng lát cắt nhỏ, ghép lại thành một tình yêu rất lớn.' },
  { type: 'text-dark', start: 173, end: 192, transition: 'crossfade', title: 'Cảm ơn em<br>vì đã luôn ở đây.', text: 'Và cảm ơn vì những năm tháng mình đã có nhau.' },
  { type: 'photo', start: 192, end: 211, transition: 'slide-left', image: 'images/2026.1.jpg', eyebrow: '2026', title: 'VẪN RUNG ĐỘNG', text: 'Mỗi lần nhìn lại, anh vẫn thấy mình may mắn như ngày đầu.' },
  { type: 'polaroid', start: 211, end: 234, transition: 'page-turn', image: 'images/2026.2.jpg', date: '2026', title: 'NƠI MÌNH<br>THÍCH NHẤT', text: 'Là bất cứ nơi nào, miễn nơi đó có hai đứa mình.' },
  { type: 'montage', start: 234, end: 251, transition: 'push', image: 'images/2025.1.jpg', secondImage: 'images/2026.jpg', title: 'KHÔNG CHỈ LÀ<br>MỘT KỶ NIỆM', text: 'Là một câu chuyện vẫn đang được viết bằng tình yêu.' },
  { type: 'photo', start: 251, end: 267, transition: 'zoom-through', image: 'images/2026.2.jpg', eyebrow: '2026', title: 'Ở ĐÂY,<br>BÊN EM', text: 'Và anh vẫn muốn nắm tay em, đi qua thật nhiều mùa nữa.' },
  { type: 'final', start: 267, end: 281, transition: 'crossfade', image: 'images/2026.2.jpg', heartImages: ['images/child.jpg', 'images/2022.jpg', 'images/2023.jpg', 'images/2024.jpg', 'images/2025.jpg', 'images/2025.1.jpg', 'images/2026.jpg', 'images/2026.1.jpg', 'images/2026.2.jpg'], eyebrow: 'BỐN NĂM RỒI...', title: 'VÀ ANH VẪN MUỐN CÓ EM<br>TRONG NHỮNG CHƯƠNG TIẾP THEO.', text: 'HẾT RỒI SAO? &nbsp; <em>MÌNH VIẾT TIẾP NHÉ...</em>' }
];

const film = document.querySelector('#film');
const stage = document.querySelector('#sceneStage');
const audio = document.querySelector('#soundtrack');
const intro = document.querySelector('#intro');
const startButton = document.querySelector('#startButton');

let activeIndex = 0;
let hasStarted = false;

const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const timeString = seconds => {
  const whole = Math.max(0, Math.floor(seconds || 0));
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
};

function sceneMarkup(scene, index) {
  const classes = ['scene', `scene--${scene.type}`, `transition-${scene.transition || 'slide-left'}`, index === 0 ? 'is-active' : 'is-after'];
  const safeTitle = scene.title || '';
  const copy = `<div class="scene__copy ${scene.copyPosition === 'right' ? 'scene__copy--right' : ''}">
    ${scene.date ? `<p class="scene__date">${escapeHTML(scene.date)}</p>` : ''}
    ${scene.eyebrow ? `<p class="scene__eyebrow">${escapeHTML(scene.eyebrow)}</p>` : ''}
    <h2 class="scene__title">${safeTitle}</h2>
    ${scene.text ? `<p class="scene__text">${scene.text}</p>` : ''}
  </div>`;

  if (scene.type === 'text' || scene.type === 'text-dark') return `<section class="${classes.join(' ')}" data-index="${index}">${copy}</section>`;
  if (scene.type === 'opening') return `<section class="${classes.join(' ')}" data-index="${index}" style="--image: url('${scene.image}')"><div class="scene__background"></div><div class="scene__wash"></div>${copy}</section>`;

  const picture = (source) => `<img src="${source}" alt="Kỷ niệm của chúng mình" onerror="this.onerror=null;this.src='images/placeholder.svg'" />`;

  if (scene.type === 'final') {
    const heartImages = scene.heartImages || [scene.image];
    return `<section class="${classes.join(' ')}" data-index="${index}" style="--image: url('${scene.image}')">
      <div class="scene__background"></div><div class="scene__wash"></div>
      <div class="heart-collage" aria-label="Chín kỷ niệm của chúng mình">${heartImages.map((source, imageIndex) => `<figure class="heart-photo heart-photo--${imageIndex + 1}">${picture(source)}</figure>`).join('')}</div>${copy}</section>`;
  }

  if (scene.type === 'montage') return `<section class="${classes.join(' ')}" data-index="${index}" style="--image: url('${scene.image}')">
    <div class="scene__background"></div><div class="scene__wash"></div>
    <figure class="photo-frame">${picture(scene.image)}</figure>
    <figure class="photo-frame photo-frame--second">${picture(scene.secondImage || scene.image)}</figure>${copy}</section>`;

  return `<section class="${classes.join(' ')}" data-index="${index}" style="--image: url('${scene.image}')">
    <div class="scene__background"></div><div class="scene__wash"></div>
    ${scene.type === 'polaroid' ? '<span class="tape" aria-hidden="true"></span>' : ''}
    <figure class="photo-frame">${picture(scene.image)}</figure>${copy}</section>`;
}

stage.innerHTML = scenes.map(sceneMarkup).join('');
const panels = [...stage.querySelectorAll('.scene')];

function showScene(nextIndex, immediate = false) {
  const index = Math.min(scenes.length - 1, Math.max(0, nextIndex));
  if (index === activeIndex && !immediate) return;
  activeIndex = index;
  panels.forEach((panel, panelIndex) => {
    panel.classList.remove('is-active', 'is-before', 'is-after');
    if (panelIndex < index) panel.classList.add('is-before');
    if (panelIndex > index) panel.classList.add('is-after');
  });
  const current = panels[index];
  if (immediate) {
    current.style.transition = 'none';
    current.classList.add('is-active');
    requestAnimationFrame(() => { current.style.transition = ''; });
  } else {
    requestAnimationFrame(() => current.classList.add('is-active'));
  }
}

function indexAt(time) {
  const found = scenes.findIndex(scene => time >= scene.start && time < scene.end);
  return found === -1 ? scenes.length - 1 : found;
}

function updatePlayer() {
  const currentTime = audio.currentTime || 0;
  const nextIndex = indexAt(currentTime);
  if (nextIndex !== activeIndex) showScene(nextIndex);
}

async function playStory() {
  if (!hasStarted) {
    hasStarted = true;
    intro.classList.add('is-hidden');
  }
  try { await audio.play(); } catch (error) { console.warn('Audio needs a user gesture to play.', error); }
}

startButton.addEventListener('click', () => { audio.currentTime = 0; showScene(0, true); window.__userPausedMusic = false; playStory(); });

audio.addEventListener('loadedmetadata', updatePlayer);
audio.addEventListener('timeupdate', updatePlayer);
audio.addEventListener('play', () => { film.classList.remove('is-paused'); window.__userPausedMusic = false; });
audio.addEventListener('pause', () => { film.classList.add('is-paused'); });
audio.addEventListener('ended', () => { film.classList.add('is-paused'); showScene(scenes.length - 1); });

/* Rời tab / tắt màn hình: điện thoại tự pause nhạc — không phải người dùng dừng.
   Quay lại tab (hoặc bấm Back về) thì tự phát tiếp, bộ phim chạy tiếp như cũ. */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && hasStarted && audio.paused && !audio.ended && !window.__userPausedMusic) {
    audio.play().catch(() => {});
  }
  updatePlayer();
});
window.addEventListener('pageshow', () => {
  if (hasStarted && audio.paused && !audio.ended && !window.__userPausedMusic) audio.play().catch(() => {});
  updatePlayer();
});

updatePlayer();
