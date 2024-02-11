// Function to create a card for a dog
function createCard(pet) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.name = pet.name;
  card.innerHTML = `
    <header class="card-header">
      <p class="card-header-title">${pet.name}</p>
      <button class="heart-button">
        <i class="far fa-heart"></i>
      </button>
    </header>
    <div class="card-image">
      <figure class="image is-4by3">
        <img src="image.jpg" alt="Pet image for ${pet.name}">
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <strong>Age:</strong> ${pet.age}<br>
        <strong>Breed:</strong> ${pet.breed}<br>
        <strong>Description:</strong> ${pet.description}
        <button class="button more-info" id="more-info-${pet.name}">More Info</button>
        <div class="additional-info is-hidden" id="additional-info-${pet.name}">
          <!-- Additional info here -->
        </div>
      </div>
    </div>
  `;

  // Attach event listeners
  const heartBtn = card.querySelector('.heart-button');
  heartBtn.addEventListener('click', function() {
    // Toggle the "saved" state and the heart icon class
    this.classList.toggle('saved');
    const icon = this.querySelector('i');
    icon.classList.toggle('fas');
    icon.classList.toggle('far');
  });

  // More info event listener (if you have additional logic to show more info)
  const moreInfoBtn = card.querySelector('.more-info');
  moreInfoBtn.addEventListener('click', function() {
    const additionalInfoDiv = card.querySelector(`#additional-info-${pet.name}`);
    if (additionalInfoDiv.classList.contains('is-hidden')) {
      fetchBreedInfo(pet.breed, additionalInfoDiv); // Fetch additional breed info
    }
    additionalInfoDiv.classList.toggle('is-hidden');
    this.textContent = additionalInfoDiv.classList.contains('is-hidden') ? 'More Info' : 'Less Info';
  });

  return card;
}



// Function to fetch breed information
function fetchBreedInfo(breed, container) {
  // Placeholder for your API URL and API key
  const apiUrl = `https://api.thedogapi.com/v1/breeds/search?q=${breed}`;
  const apiKey = process.env.API_KEY;

  // Fetch the dog breed information
  fetch(apiUrl, { headers: { 'x-api-key': apiKey } })
    .then(response => response.json())
    .then(breedInfo => {
      // Assuming breedInfo is an array and you take the first result
      const info = breedInfo[0] || {};
      container.innerHTML = `
        <strong>Average Weight:</strong> ${info.weight?.metric}<br>
        <strong>Average Height:</strong> ${info.height?.metric}<br>
        <strong>Life Span:</strong> ${info.life_span}<br>
        <strong>Temperament:</strong> ${info.temperament}<br>
      `;
    })
    .catch(error => {
      console.error('Error fetching breed info:', error);
      container.innerHTML = `<p>Error fetching breed information.</p>`;
    });
}


  
// Function to add cards to the carousel
function addCardsToCarousel(petsData) {
  const carouselContent = document.querySelector('.carousel-content');
  carouselContent.innerHTML = ''; // Clear existing content
  petsData.forEach(pet => {
    const card = createCard(pet);
    carouselContent.appendChild(card);
  });
}

// Fetch pets data from the server
function fetchPetsData() {
  fetch('/api/dogs') // Adjust this URL to match your actual API endpoint
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      addCardsToCarousel(data); // Assuming the data is an array of pets
    })
    .catch(error => {
      console.error('Error fetching dog data:', error);
    });
}


// Carousel arrow functionality
function setupCarousel() {
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  let currentIndex = 0;

  // Attach event listeners to arrows
  leftArrow.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel(currentIndex);
  });
  
  rightArrow.addEventListener('click', () => {
    const cards = document.querySelectorAll('.carousel-content .card');
    currentIndex = Math.min(currentIndex + 1, cards.length - 1);
    updateCarousel(currentIndex);
  });
}

// Update the carousel position based on currentIndex
function updateCarousel(currentIndex) {
  const cardWidth = document.querySelector('.card').offsetWidth;
  const carouselContent = document.querySelector('.carousel-content');
  const newTransform = currentIndex * -(cardWidth + 20);
  carouselContent.style.transform = `translateX(${newTransform}px)`;
  




  // Call fetchPetsData when DOM content is loaded
  document.addEventListener('DOMContentLoaded', () => {
    fetchPetsData();
    setupCarousel();
  });



  ///fix 

// If pet is saved, it goes to the saved section
if(pet.saved) {
  savedPetsContainer.appendChild(card);
} else {
  carouselContent.appendChild(card);
}

return card;
}
      
  
// Function to update saved pets section and appends whole card to saved container
function updateSavedPetsSection(petCard, pet) {
  if (pet.saved) {
    savedPetsContainer.appendChild(petCard);
  } else {
    // Move the card back to the top carousel when the card is unsaved
    carouselContent.appendChild(petCard);
  }

  //hide the saved pets section if no saved pets 
  const savedPetsSection = document.getElementById('saved-pets-section');
  savedPetsSection.style.display = savedPetsContainer.children.length > 0 ? 'block' : 'none';
}
  
// Generate the cards for each pet
petsData.forEach(pet => {
  createCard(pet); // This will also handle placing the card in the correct section based on its saved status
});



// Evan's more info button event listener 
moreInfo.addEventListener('click', () => {
  const dogName = event.target.id; // Gets the name of the specific dog
  // Gets the breed of the specific dog
  const breed = () => {
    for (let i = 0; i < petBreed.length; i++) {
      if (petBreed[i].name === dogName) {
        return petBreed[i].breed;
      }
    }
  };
  url = 'http://localhost:3001/api/dogInfo/'; // This is the route that will be created in the backend

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(breed),
    }).then((response) => {
      // Parse the response
      const breedInfo = {
        weight: response.weight,
        height: response.height,
        life_span: response.life_span,
        temperament: response.temperament,
      };
    })
  })
      
updateCarousel();