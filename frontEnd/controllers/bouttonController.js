  function openPopup(id) {
    document.getElementById(id).classList.add('active');
  }

  function closePopup(id) {
    document.getElementById(id).classList.remove('active');
  }

  // BONUS : fermer en cliquant à l'extérieur du formulaire
  window.addEventListener('click', function(event) {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
      if (event.target === popup) {
        popup.classList.remove('active');
      }
    });
  });

