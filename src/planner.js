// Initialize or retrieve the meal planner from local storage
let mealPlanner = JSON.parse(localStorage.getItem('mealPlanner')) || [];

// Add a meal to the planner
function addToPlanner(meal) {
  mealPlanner.push(meal);
  localStorage.setItem('mealPlanner', JSON.stringify(mealPlanner));
  alert(`${meal.strMeal} has been added to your planner.`);
}

// Display all meals in the planner
function displayPlanner() {
    const plannerDiv = document.getElementById('planner');
    plannerDiv.innerHTML = mealPlanner.map(meal => `
      <div class="meal-card">
        <h3>${meal.strMeal}</h3>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <button onclick="viewMealDetails('${meal.idMeal}')">View Details</button>
        <button onclick="editMeal('${meal.idMeal}')">Edit Notes</button>
        <button onclick="removeFromPlanner('${meal.idMeal}')">Delete</button>
      </div>
    `).join('');
  }
// Update notes for a meal in the planner
function editMeal(mealId) {
  const meal = mealPlanner.find(meal => meal.idMeal === mealId);
  if (meal) {
    const newNotes = prompt("Edit your notes:", meal.notes || "");
    meal.notes = newNotes; // Update notes for the meal
    localStorage.setItem('mealPlanner', JSON.stringify(mealPlanner));
    alert(`Notes for ${meal.strMeal} updated.`);
    displayPlanner();
  }
}

// Remove a meal from the planner
function removeFromPlanner(mealId) {
  mealPlanner = mealPlanner.filter(meal => meal.idMeal !== mealId);
  localStorage.setItem('mealPlanner', JSON.stringify(mealPlanner));
  alert("Meal removed from planner.");
  displayPlanner();
}

// Function to view meal details
function viewMealDetails(mealId) {
    // Save the selected meal ID to localStorage
    localStorage.setItem('selectedMealId', mealId);
    
    // Redirect to the meal details page
    window.location.href = 'meal-details.html';
  }
  
// Initialize weekly meal planner from local storage
let weeklyMealPlanner = JSON.parse(localStorage.getItem('weeklyMealPlanner')) || {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: []
};

// Add a meal to a specific day
function addToPlanner(meal, day) {
  weeklyMealPlanner[day].push(meal);
  localStorage.setItem('weeklyMealPlanner', JSON.stringify(weeklyMealPlanner));
  displayPlanner();
}

// Display meals for each day
function displayPlanner() {
  Object.keys(weeklyMealPlanner).forEach(day => {
      const dayContainer = document.querySelector(`#${day} .meal-container`);
      dayContainer.innerHTML = weeklyMealPlanner[day].map(meal => `
          <div class="meal-card">
              <h3>${meal.strMeal}</h3>
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <button onclick="viewMealDetails('${meal.idMeal}')">View Details</button>
              <button onclick="editMeal('${meal.idMeal}', '${day}')">Edit Notes</button>
              <button onclick="removeFromPlanner('${meal.idMeal}', '${day}')">Delete</button>
          </div>
      `).join('') || '<p class="empty-day">No meals planned</p>';
  });
}

// Edit meal notes
function editMeal(mealId, day) {
  const mealIndex = weeklyMealPlanner[day].findIndex(meal => meal.idMeal === mealId);
  if (mealIndex !== -1) {
      const meal = weeklyMealPlanner[day][mealIndex];
      const newNotes = prompt("Edit your notes:", meal.notes || "");
      weeklyMealPlanner[day][mealIndex].notes = newNotes;
      localStorage.setItem('weeklyMealPlanner', JSON.stringify(weeklyMealPlanner));
      displayPlanner();
  }
}

// Remove a meal from a specific day
function removeFromPlanner(mealId, day) {
  weeklyMealPlanner[day] = weeklyMealPlanner[day].filter(meal => meal.idMeal !== mealId);
  localStorage.setItem('weeklyMealPlanner', JSON.stringify(weeklyMealPlanner));
  displayPlanner();
}

// View meal details
function viewMealDetails(mealId) {
  localStorage.setItem('selectedMealId', mealId);
  window.location.href = 'meal-details.html';
}

// Initialize planner on page load
window.onload = displayPlanner;

// Function to be called from search page when adding a meal
function addMealToDay(meal) {
  const day = prompt("Which day would you like to add this meal to? (Monday-Sunday)");
  if (day && weeklyMealPlanner[day]) {
      addToPlanner(meal, day);
      alert(`${meal.strMeal} has been added to ${day}`);
  } else {
      alert("Please enter a valid day of the week.");
  }
}

// Load planner items on page load
window.onload = displayPlanner;
