document.querySelectorAll('.note-card').forEach(card => {
  const header = card.querySelector('.note-card-header');
  const content = card.querySelector('.note-card-content');

  header.addEventListener('click', () => {
    card.classList.toggle('expanded');
  });
});

document.querySelectorAll('.note-image').forEach(img => {
  img.addEventListener('click', () => {
    img.classList.toggle('expanded');
  });
});