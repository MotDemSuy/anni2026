/* All editable story timing/content lives here. `start` / `end` use seconds in Sau-Tat-Ca-Em-Van-O-Day.mp3. */
const scenes = [
  { type: 'spread', start: 0, end: 12, image: 'images/child.jpg', layout: 'portrait', kicker: 'BỐN NĂM RỒI...', title: 'Anh vẫn nhớ...', text: 'những ngày đầu tiên của câu chuyện này.', note: 'một kỷ niệm thật bé', transition: 'soft-page-flip' },
  { type: 'photo', start: 12, end: 29, image: 'images/2022.jpg', year: '2022', layout: 'portrait', title: 'Từ một ngày<br>rất bình thường...', text: 'mình bắt đầu có nhau.', transition: 'soft-page-flip' },
  { type: 'photo', start: 29, end: 44, image: 'images/2023.jpg', year: '2023', layout: 'tilt-left', title: 'Rồi những ngày<br>bên nhau cứ dài thêm.', text: 'Và từng trang nhỏ dần có hình dáng của em.', note: 'những điều thật dịu dàng', transition: 'page-flip' },
  { type: 'spread', start: 44, end: 60, image: 'images/2024.jpg', year: '2024', layout: 'wide offset', title: 'Chẳng biết<br>từ lúc nào...', text: 'những điều rất nhỏ cũng thành điều anh nhớ.', transition: 'double-spread' },
  { type: 'photo', start: 60, end: 74, image: 'images/2025.jpg', year: '2025', layout: 'portrait', title: 'Có những ngày<br>chẳng cần điều gì lớn lao...', text: 'chỉ cần có nhau là đủ.', transition: 'page-reveal' },
  { type: 'photo', start: 74, end: 91, image: 'images/2025.1.jpg', year: '2025', layout: 'tilt-right tape clipped', title: 'Một tấm ảnh<br>được kẹp lại...', text: 'để mỗi lần mở ra, anh lại thấy mình mỉm cười.', transition: 'polaroid-place' },
  { type: 'photo', start: 91, end: 113, image: 'images/2026.jpg', year: '2026', layout: 'wide', title: 'Và đến hôm nay...', text: 'anh vẫn muốn nhìn thấy em ở bên cạnh.', transition: 'page-flip' },
  { type: 'spread', start: 113, end: 139, image: 'images/2026.1.jpg', year: '2026', layout: 'tilt-left tape', title: 'Sau tất cả...', text: 'em vẫn ở đây.', note: 'điều anh muốn giữ lại', transition: 'soft-page-flip' },
  { type: 'text', start: 139, end: 155, title: 'Có những lúc anh nghĩ...', text: 'chắc mọi thứ chỉ còn là ký ức.<br><br>Nhưng rồi anh nhìn lại...<br><strong>em vẫn ở đây.</strong>', transition: 'fade-through' },
  { type: 'spread', start: 155, end: 190, image: 'images/2026.2.jpg', year: '2026', layout: 'wide', title: 'Bốn năm rồi.', text: 'Và anh vẫn muốn viết tiếp.', transition: 'slow-crossfade' },
  { type: 'heart-collage', start: 190, end: 224.24, images: ['images/child.jpg', 'images/2022.jpg', 'images/2023.jpg', 'images/2024.jpg', 'images/2025.jpg', 'images/2025.1.jpg', 'images/2026.jpg', 'images/2026.1.jpg', 'images/2026.2.jpg'], title: 'VÀ ANH VẪN MUỐN CÓ EM<br>TRONG NHỮNG CHƯƠNG TIẾP THEO.', text: 'HẾT RỒI SAO?<br><em>MÌNH VIẾT TIẾP NHÉ...</em>', transition: 'memory-stack' }
];

const experience = document.querySelector('#experience');
const bookPages = document.querySelector('#bookPages');
const cover = document.querySelector('#cover');
const startButton = document.querySelector('#startButton');
const music = document.querySelector('#music');
let activeIndex = 0;
let started = false;

const picture = source => `<img src="${source}" alt="Kỷ niệm của chúng mình" />`;
const clean = value => value ? `<p class="page-year">${value}</p>` : '';
function copy(scene, options = {}) {
  return `<div class="page-copy ${options.center ? 'page-copy--center' : ''} ${options.bottom ? 'page-copy--bottom' : ''}">
    ${scene.kicker ? `<p class="page-kicker">${scene.kicker}</p>` : ''}${clean(scene.year)}
    ${scene.title ? `<h2 class="page-title">${scene.title}</h2>` : ''}
    ${scene.text ? `<p class="page-text">${scene.text}</p>` : ''}${options.rule ? '<span class="page-rule"></span>' : ''}
  </div>`;
}
function card(scene) {
  const kinds = scene.layout?.split(' ') || ['portrait'];
  const classNames = kinds.map(kind => `photo-card--${kind}`).join(' ');
  return `<figure class="photo-card ${classNames}">${picture(scene.image)}</figure>`;
}
function heart(images) { return images.map((image, index) => `<figure class="heart-photo heart-photo--${index + 1}">${picture(image)}</figure>`).join(''); }
function sceneMarkup(scene, index) {
  const base = `album-page album-page--${scene.type} transition-${scene.transition || 'page-flip'} ${index === 0 ? 'is-active' : 'is-future'}`;
  if (scene.type === 'text') return `<section class="${base} album-page--quiet" data-index="${index}"><div class="page-half">${copy(scene, { center: true })}</div></section>`;
  if (scene.type === 'heart-collage') return `<section class="${base}" data-index="${index}"><div class="heart-layout"><div class="heart-collage-wrap"><div class="heart-collage">${heart(scene.images)}</div></div><div class="page-copy ending-copy"><p class="page-kicker ending-line ending-line--1">BỐN NĂM RỒI...</p><h2 class="page-title ending-line ending-line--2">${scene.title}</h2><p class="page-text ending-line ending-line--3">${scene.text}</p></div></div></section>`;
  const note = scene.note ? `<p class="page-note ${scene.type === 'spread' ? 'page-note--right' : ''}">${scene.note}</p>` : '';
  const photoRight = index % 2 === 0;
  return `<section class="${base}" data-index="${index}">
    <div class="page-half page-half--left">${photoRight ? copy(scene, { bottom: true, rule: scene.type === 'photo' }) : card(scene)}${photoRight ? '' : note}</div>
    <div class="page-half page-half--right">${photoRight ? card(scene) + note : copy(scene, { bottom: true, rule: scene.type === 'photo' })}</div>
  </section>`;
}

bookPages.innerHTML = scenes.map(sceneMarkup).join('');
const pages = [...bookPages.querySelectorAll('.album-page')];

function showPage(nextIndex, immediate = false) {
  const index = Math.max(0, Math.min(scenes.length - 1, nextIndex));
  if (index === activeIndex && !immediate) return;
  activeIndex = index;
  pages.forEach((page, pageIndex) => {
    page.classList.remove('is-active', 'is-past', 'is-future');
    page.classList.add(pageIndex < index ? 'is-past' : pageIndex > index ? 'is-future' : 'is-active');
    if (immediate) { page.style.transition = 'none'; requestAnimationFrame(() => { page.style.transition = ''; }); }
  });
}
function indexAt(time) { const found = scenes.findIndex(scene => time >= scene.start && time < scene.end); return found === -1 ? scenes.length - 1 : found; }
function update() {
  if (!started) return;
  const index = indexAt(music.currentTime);
  if (index !== activeIndex) showPage(index);
  if (!music.paused && !music.ended) requestAnimationFrame(update);
}
async function begin() {
  if (started) return;
  started = true;
  experience.classList.add('is-playing');
  cover.classList.add('is-opening');
  try { await music.play(); } catch (error) { console.warn('Audio cần được phát từ thao tác người dùng.', error); }
  showPage(0, true);
  requestAnimationFrame(update);
}

// Prepare every asset while the cover is open; no interaction is required afterward.
scenes.flatMap(scene => scene.images || (scene.image ? [scene.image] : [])).forEach(source => { const image = new Image(); image.src = source; });
startButton.addEventListener('click', begin);
music.addEventListener('play', () => { if (started) requestAnimationFrame(update); });
music.addEventListener('ended', () => showPage(scenes.length - 1));
