// Existing offering cards functionality
    document.querySelectorAll('.offering-card').forEach(card => {
      card.addEventListener('click', () => {
        alert(`You clicked on "${card.querySelector('h3').textContent}"`);
      });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && loginModal.classList.contains('active')) {
        loginModal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
