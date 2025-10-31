document.querySelectorAll('.note-card').forEach(card => {
  const header = card.querySelector('.note-card-header');
  const content = card.querySelector('.note-card-content');

  header.addEventListener('click', () => {
    if (card.classList.contains('expanded')) {
      // collapse
      content.style.maxHeight = 0;
      card.classList.remove('expanded');
    } else {
      // expand
      content.style.maxHeight = content.scrollHeight + "px";
      card.classList.add('expanded');
    }
  });
});


document.querySelectorAll('.note-image').forEach(img => {
  img.addEventListener('click', () => {
    img.classList.toggle('expanded');
  });
});