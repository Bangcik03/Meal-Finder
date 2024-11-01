
// Initialize the page by fetching categories and ingredients and displaying initial search results
window.onload = () => {
  fetchCategories();
  fetchIngredients();
};

// Fetch categories and populate the category filter dropdown
async function fetchCategories() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    const data = await response.json();
    const categoryFilter = document.getElementById('categoryFilter');

    data.meals.forEach(category => {
      const option = document.createElement('option');
      option.value = category.strCategory;
      option.textContent = category.strCategory;
      categoryFilter.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Fetch ingredients and populate the ingredient filter dropdown
async function fetchIngredients() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    const data = await response.json();
    const ingredientFilter = document.getElementById('ingredientFilter');

    data.meals.forEach(ingredient => {
      const option = document.createElement('option');
      option.value = ingredient.strIngredient;
      option.textContent = ingredient.strIngredient;
      ingredientFilter.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
  }
}

// Fetch and display meals based on search input, category, and ingredient filters
async function searchMeal() {
  const query = document.getElementById('searchInput').value.trim();
  const category = document.getElementById('categoryFilter').value;
  const ingredient = document.getElementById('ingredientFilter').value;

  // Determine URL based on selected filters
  let url;
  if (category) {
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
  } else if (ingredient) {
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
  } else {
    url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    displaySearchResults(data.meals || []);
  } catch (error) {
    console.error('Error fetching meals:', error);
  }
}

// Display search results in the grid
function displaySearchResults(meals) {
  const searchResultsDiv = document.getElementById('searchResults');
  const errorMessageDiv = document.getElementById('errorMessage');

  if (meals.length === 0) {
    // Show error message if no meals are found
    errorMessageDiv.style.display = 'block';
    searchResultsDiv.innerHTML = ''; // Clear previous results
  } else {
    // Hide error message if meals are found
    errorMessageDiv.style.display = 'none';
    searchResultsDiv.innerHTML = meals.map((meal) => `
      <div class="meal-card">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-img"/>
        <div class="meal-info">
          <h3>${meal.strMeal}</h3>
          <button onclick="viewMealDetails('${meal.idMeal}')">View Details</button>
        </div>
      </div>
    `).join('');
  }
}


// Function to view meal details by redirecting to the details page
function viewMealDetails(mealId) {
  localStorage.setItem('selectedMealId', mealId);
  window.location.href = 'meal-details.html';
}

// Function to handle filtering when a dropdown value is changed
function filterMeals() {
  searchMeal();
}
