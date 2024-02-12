document.addEventListener('DOMContentLoaded', () => {
  const carouselContent = document.querySelector('.carousel-content');
  const savedPetsContainer = document.getElementById('saved-pets-container');
  const savedPetsSection = document.getElementById('saved-pets-section');

  // Function to update the display of the saved pets section
  function updateSavedPetsDisplay() {
    savedPetsSection.style.display = savedPetsContainer.children.length > 0 ? 'block' : 'none';
  }

  // Function to fetch and display dog breed information from API
  async function fetchAndDisplayBreedInfo(petName, breedInfoDiv) {
    try {
      const breedInfo = await fetch(`/api/breed-info/${petName}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }).then(response => response.json());

      breedInfoDiv.innerHTML = `
        <h3>Breed Info</h3>
        <strong>Average Weight:</strong> ${breedInfo.weight}<br>
        <strong>Average Height:</strong> ${breedInfo.height}<br>
        <strong>Typical Life Span:</strong> ${breedInfo.life_span}<br>
        <strong>Temperament:</strong> ${breedInfo.temperament}<br>
      `;
      breedInfoDiv.dataset.loaded = 'true';
    } catch (error) {
      console.error('Error fetching breed info:', error);
    }
  }

  moreInfoButtons = document.querySelectorAll('.more-info');

  moreInfoButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const name = e.target.getAttribute('data-name');
      const additionalInfo = document.getElementById(`additional-info-${name}`);
      const breedInfo = document.getElementById(`breed-info-${name}`);
      additionalInfo.classList.toggle('is-hidden');
      breedInfo.classList.toggle('is-hidden');
    });
  });

  // Function to toggle favorite status and move card
  function toggleFavoriteAndMoveCard(heartBtn, petCard) {
    heartBtn.classList.toggle('saved');
    const isSaved = heartBtn.classList.contains('saved');
    heartBtn.innerHTML = isSaved ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';

    if (isSaved) {
      savedPetsContainer.appendChild(petCard);
    } else {
      carouselContent.appendChild(petCard);
    }
    updateSavedPetsDisplay();
  }

  // Event delegation for handling clicks within the carousel content area
  carouselContent.addEventListener('click', async (event) => {
    const target = event.target;
    const petCard = target.closest('.card');
    const petName = petCard.dataset.name;
    const additionalInfoDiv = petCard.querySelector('.additional-info');
    const breedInfoDiv = additionalInfoDiv.querySelector('.breed-info');

    if (target.matches('.heart-button, .heart-button *')) { // Check if heart button or its child is clicked
      toggleFavoriteAndMoveCard(target.closest('.heart-button'), petCard);
    } else if (target.matches('.more-info')) {
      const additionalInfoDiv = petCard.querySelector('.additional-info');
      const breedInfoDiv = additionalInfoDiv.querySelector('.breed-info');
      const isHidden = additionalInfoDiv.classList.toggle('is-hidden');
      target.textContent = isHidden ? 'More Info' : 'Less Info';

      if (!breedInfoDiv.dataset.loaded) {
        fetchAndDisplayBreedInfo(petCard.dataset.name, breedInfoDiv);
      }
    }
  });

  updateSavedPetsDisplay();
});