// interactive.js
// Handles timeline tab switching and description updates

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const description = document.getElementById('stage-description');

  const stageTexts = {
    chaturanga: `c. 550 AD – Chaturanga, the earliest known predecessor, was played on an 8×8 board with pieces representing infantry, cavalry, elephants and chariots. Moves were limited: the king (Raja) moved one square, the elephant (Gaja) moved two squares diagonally, the horse (Ashva) moved like a knight, and the chariot (Ratha) moved like a rook.`,
    shatranj: `c. 570 AD – The Persian version “Shatranj” introduced the “fers” (counselor) that later became the queen, and the bishop (al‑fil) that jumped two squares diagonally. The game spread throughout the Islamic world and reached Europe via Spain and Italy, influencing medieval strategy games.`,
    modern: `Late 15th century – The queen gained her modern powerful moves and the pawn acquired the two‑step advance. The 19th century standardized castling, en‑passant, and the Staunton piece set. 1924 – FIDE was founded, establishing official rules, ratings, and world championships that continue today.`
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      description.textContent = stageTexts[tab.dataset.stage] || '';
    });
  });

  // ==== Scroll‑fade‑in (Krølbøll effect) ====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => entry.target.classList.toggle('visible', entry.isIntersecting));
  }, { threshold: 0.2 });
  document.querySelectorAll('.section').forEach(sec => observer.observe(sec));

  // ==== Modal for adding new inspirations ====
  const openBtn = document.getElementById('openModalBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const modal = document.getElementById('addModal');
  const form = document.getElementById('addForm');
  const grid = document.getElementById('inspirationsGrid');

  const renderCard = (title, imgUrl, desc) => {
    const card = document.createElement('div');
    card.className = 'card glass';
    card.innerHTML = `
      <img src="${imgUrl}" alt="${title}" />
      <p>${desc}</p>
    `;
    grid.appendChild(card);
  };

  // Load persisted cards
  const saved = JSON.parse(localStorage.getItem('inspirations') || '[]');
  saved.forEach(item => renderCard(item.title, item.img, item.desc));

  openBtn.addEventListener('click', () => { modal.style.display = 'block'; });
  closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('titleInput').value.trim();
    const img = document.getElementById('imgInput').value.trim();
    const desc = document.getElementById('descInput').value.trim();
    if (!title || !img || !desc) return;
    const newItem = {title, img, desc};
    renderCard(title, img, desc);
    saved.push(newItem);
    localStorage.setItem('inspirations', JSON.stringify(saved));
    form.reset();
    modal.style.display = 'none';
  });
});
  const tabs = document.querySelectorAll('.tab');
  const description = document.getElementById('stage-description');

  const stageTexts = {
    chaturanga: `Chaturanga, the oldest known predecessor of chess, was played on an 8×8 board with pieces representing infantry, cavalry, elephants, and chariots. Moves were limited: the king (Raja) moved one square, the elephant (Gaja) moved two squares diagonally, the horse (Ashva) moved like a knight, and the chariot (Ratha) moved like a rook.`,
    shatranj: `Shatranj, the Persian adaptation (7th‑9th century), introduced the ‘fers’ (counselor) which later became the queen, and the bishop (alfil) that jumped two squares diagonally. The game spread throughout the Islamic world and reached Europe via Spain and Italy, influencing medieval strategy games.`,
    modern: `Modern chess, standardized in the 19th century, gave the queen her current powerful moves and introduced the two‑step pawn advance, castling, and en‑passant. The World Chess Federation (FIDE) was founded in 1924, establishing official rules, ratings, and world championships that persist today.`
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked
      tab.classList.add('active');
      // Update description
      const stage = tab.dataset.stage;
      description.textContent = stageTexts[stage] || '';
    });
  });
});
