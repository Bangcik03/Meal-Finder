// Get the selected meal ID from localStorage
const mealId = localStorage.getItem('selectedMealId');

// Fetch meal details using the meal ID
async function fetchMealDetails() {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();

    if (data.meals) {
      displayMealDetails(data.meals[0]);
      localStorage.setItem('currentMealDetails', JSON.stringify(data.meals[0]));
    } else {
      console.log("Meal not found.");
    }
  } catch (error) {
    console.error("Error fetching meal details:", error);
  }
}

// Display meal details on the page
function displayMealDetails(meal) {
  const mealDetailsDiv = document.getElementById('mealDetails');
  
  // Extract ingredients and measurements
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`);
    }
  }

  // Create the HTML content
  mealDetailsDiv.innerHTML = `
    <h2 id='mealName'>${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-img"/>
    <p><strong>Category:</strong> ${meal.strCategory}</p>
    <p><strong>Area:</strong> ${meal.strArea}</p>
    <p><strong>Instructions:</strong></p>
    <p>${meal.strInstructions}</p>
    <h3>Ingredients:</h3>
    <ul class="ingredients-list">
      ${ingredients.map(ingredient => `<li class="ingredient-item">${ingredient}</li>`).join('')}
    </ul>
    ${meal.strYoutube ? `<p><strong>Watch on YouTube:</strong> <a href="${meal.strYoutube}" target="_blank">Recipe Video</a></p>` : ''}
  `;
}

// Function to show day selection dialog
function showDaySelectionDialog(meal) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const dialogOverlay = document.createElement('div');
  dialogOverlay.className = 'dialog-overlay';
  
  const dialog = document.createElement('div');
  dialog.className = 'day-selection-dialog';
  
  dialog.innerHTML = `
    <h3>Select a day to add "${meal.strMeal}"</h3>
    <div class="day-buttons">
      ${days.map(day => `
        <button class="day-button" data-day="${day}">${day}</button>
      `).join('')}
    </div>
    <button class="cancel-button">Cancel</button>
  `;
  
  dialogOverlay.appendChild(dialog);
  document.body.appendChild(dialogOverlay);
  
  // Add event listeners for day selection
  const dayButtons = dialog.querySelectorAll('.day-button');
  dayButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedDay = button.getAttribute('data-day');
      addMealToDay(meal, selectedDay);
      dialogOverlay.remove();
    });
  });
  
  // Add event listener for cancel button
  const cancelButton = dialog.querySelector('.cancel-button');
  cancelButton.addEventListener('click', () => {
    dialogOverlay.remove();
  });
}

// Function to add meal to a specific day
function addMealToDay(meal, selectedDay) {
  // Get existing weekly meal planner or initialize new one
  const weeklyMealPlanner = JSON.parse(localStorage.getItem('weeklyMealPlanner')) || {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  };

  // Create a simplified meal object
  const mealToAdd = {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    notes: ''
  };

  // Add meal to selected day
  weeklyMealPlanner[selectedDay].push(mealToAdd);
  
  // Save updated planner
  localStorage.setItem('weeklyMealPlanner', JSON.stringify(weeklyMealPlanner));
  alert(`${meal.strMeal} has been added to ${selectedDay}`);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  fetchMealDetails();
  
  // Add click event listener for the save to planner button
  const saveToPlanner = document.getElementById('saveToPlanner');
  if (saveToPlanner) {
    saveToPlanner.addEventListener('click', function() {
      const currentMeal = JSON.parse(localStorage.getItem('currentMealDetails'));
      if (currentMeal) {
        showDaySelectionDialog(currentMeal);
      } else {
        console.error('No meal details found in localStorage');
      }
    });
  }
});

// Add grocery list functionality
function addMealToGroceryList() {
  const mealData = JSON.parse(localStorage.getItem('currentMealDetails'));
  
  if (!mealData) {
    alert('Error: Meal details not found');
    return;
  }

  // Extract ingredients from meal data
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = mealData[`strIngredient${i}`];
    const measure = mealData[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: `${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`,
        checked: false
      });
    }
  }

  // Get existing grocery list or initialize new one
  const groceryList = JSON.parse(localStorage.getItem('groceryList')) || [];
  
  // Check if meal already exists in grocery list
  const mealExists = groceryList.some(item => item.mealName === mealData.strMeal);
  
  if (mealExists) {
    alert(`${mealData.strMeal} is already in your grocery list!`);
    return;
  }

  // Add new meal with ingredients
  groceryList.push({
    mealName: mealData.strMeal,
    ingredients: ingredients
  });

  // Save updated grocery list
  localStorage.setItem('groceryList', JSON.stringify(groceryList));
  
  alert(`${mealData.strMeal} and its ingredients have been added to your grocery list!`);
}