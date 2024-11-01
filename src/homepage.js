// Static popular meal IDs
const popularMealIds = ["52772", "52768", "52874", "52882", "52834", "52906", "52823", "52787", "52910"];
// Static popular ingredients
const popularIngredients = ["Chicken", "Beef", "Lamb", "Rice", "Salmon", "Tomato", "Egg", "Garlic", "Cheese"];

// Fetch and display 9 static popular meals
async function fetchPopularMeals() {
  const meals = await Promise.all(popularMealIds.map(async (id) => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals[0];
  }));
  displayItems(meals, "popularMeals", true);
}

// Fetch and display 9 random meals
async function fetchRandomMeals() {
  const meals = [];
  for (let i = 0; i < 9; i++) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await response.json();
    meals.push(data.meals[0]);
  }
  displayItems(meals, "randomMeals", true);
}

// Display items (meals or ingredients) in a 3x3 grid
function displayItems(items, containerId, isMeal) {
  const container = document.getElementById(containerId);
  container.innerHTML = items.map(item => `
    <div class="card">
      <img src="${isMeal ? item.strMealThumb : `https://www.themealdb.com/images/ingredients/${item}-Small.png`}" alt="${isMeal ? item.strMeal : item}">
      <h3>${isMeal ? item.strMeal : item}</h3>
      ${isMeal ? `<button onclick="viewMealDetails('${item.idMeal}')">View Details</button>` : ''}
    </div>
  `).join('');
}

// Display 9 static popular ingredients with images
function displayPopularIngredients() {
  displayItems(popularIngredients, "popularIngredients", false);
}

// Fetch and display 9 random ingredients with images
async function fetchRandomIngredients() {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
  const data = await response.json();
  const ingredients = data.meals
    .sort(() => 0.5 - Math.random())
    .slice(0, 9)
    .map(ingredient => ingredient.strIngredient);
  
  displayItems(ingredients, "randomIngredients", false);
}

// Redirect to meal details
function viewMealDetails(mealId) {
  localStorage.setItem('selectedMealId', mealId);
  window.location.href = 'meal-details.html';
}


// Initialize the homepage
window.onload = function() {
  fetchPopularMeals();
  fetchRandomMeals();
  displayPopularIngredients();
  fetchRandomIngredients();
};

// Add these new functions to your existing JavaScript

// Dark Mode Toggle
function setupDarkMode() {
  const darkModeToggle = document.createElement('button');
  darkModeToggle.className = 'theme-toggle';
  darkModeToggle.innerHTML = '🌓';
  darkModeToggle.setAttribute('data-tooltip', 'Toggle Dark Mode');
  document.body.appendChild(darkModeToggle);

  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });
}

// Back to Top Button
function setupBackToTop() {
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '↑';
  backToTop.setAttribute('data-tooltip', 'Back to Top');
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Search Functionality
function setupSearch() {
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  
  const searchBar = document.createElement('input');
  searchBar.type = 'text';
  searchBar.className = 'search-bar';
  searchBar.placeholder = 'Search for meals...';
  
  searchContainer.appendChild(searchBar);
  document.querySelector('main').insertBefore(searchContainer, document.querySelector('section'));

  let debounceTimer;
  searchBar.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchMeals(e.target.value);
    }, 300);
  });
}

async function searchMeals(query) {
  if (!query) {
    fetchPopularMeals();
    return;
  }

  const loader = document.querySelector('.loader');
  loader.style.display = 'block';

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    if (data.meals) {
      displayItems(data.meals.slice(0, 9), "popularMeals", true);
    }
  } catch (error) {
    console.error('Error searching meals:', error);
  } finally {
    loader.style.display = 'none';
  }
}

// Category Filters
async function setupFilters() {
  const filterContainer = document.createElement('div');
  filterContainer.className = 'filter-container';
  
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    const data = await response.json();
    
    data.meals.forEach(category => {
      const button = document.createElement('button');
      button.className = 'filter-button';
      button.textContent = category.strCategory;
      button.addEventListener('click', () => filterByCategory(category.strCategory));
      filterContainer.appendChild(button);
    });
    
    document.querySelector('main').insertBefore(filterContainer, document.querySelector('section'));
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

async function filterByCategory(category) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await response.json();
    if (data.meals) {
      displayItems(data.meals.slice(0, 9), "popularMeals", true);
    }
  } catch (error) {
    console.error('Error filtering by category:', error);
  }
}

// Initialize new features
window.onload = function() {
  fetchPopularMeals();
  fetchRandomMeals();
  displayPopularIngredients();
  fetchRandomIngredients();
  
  // Initialize new features
  setupDarkMode();
  setupBackToTop();
  setupSearch();
  setupFilters();
  
  // Add loader
  const loader = document.createElement('div');
  loader.className = 'loader';
  document.querySelector('main').appendChild(loader);
};