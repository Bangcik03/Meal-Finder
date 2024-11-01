document.addEventListener("DOMContentLoaded", () => {
  displayGroceryList();
  populateMealOptions();
  fetchAndPopulateIngredients();
});

// Fetch ingredients from TheMealDB API
async function fetchAndPopulateIngredients() {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    const data = await response.json();
    
    // Extract ingredients from the API response
    const ingredients = data.meals.map(item => item.strIngredient);
    
    // Sort ingredients alphabetically
    ingredients.sort();
    
    // Populate the dropdown with fetched ingredients
    populateIngredientDropdown(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    // Fallback to empty list if API fails
    populateIngredientDropdown([]);
  }
}

// Populate ingredient dropdown with fetched ingredients
function populateIngredientDropdown(ingredients) {
  const ingredientDropdown = document.getElementById("ingredientDropdown");
  ingredientDropdown.innerHTML = "";

  // Add a default "Select ingredient" option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select ingredient";
  ingredientDropdown.appendChild(defaultOption);

  // Add all ingredients from the API
  ingredients.forEach(ingredient => {
    if (ingredient && ingredient.trim()) { // Check for valid ingredients
      const option = document.createElement("option");
      option.value = ingredient;
      option.textContent = ingredient;
      ingredientDropdown.appendChild(option);
    }
  });
}

// Display the meals and ingredients in a checklist format
// Updated displayGroceryList function with delete buttons
function displayGroceryList() {
  const groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
  const groceryListDiv = document.getElementById("groceryList");
  groceryListDiv.innerHTML = "";

  if (groceryList.length === 0) {
    groceryListDiv.innerHTML = `
      <div class="meal-section empty-state">
        <p>Your grocery list is empty. Add items from meal details or use the form below.</p>
      </div>
    `;
    return;
  }

  groceryList.forEach((meal, mealIndex) => {
    const mealSection = document.createElement("div");
    mealSection.classList.add("meal-section");

    const mealHeader = document.createElement("h2");
    mealHeader.textContent = meal.mealName;
    mealHeader.onclick = () => deleteMeal(mealIndex);

    const ingredientList = document.createElement("ul");
    ingredientList.classList.add("ingredient-list");

    meal.ingredients.forEach((ingredient, ingredientIndex) => {
      const ingredientItem = document.createElement("li");
      
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = ingredient.checked || false;
      checkbox.addEventListener("change", () => toggleIngredient(mealIndex, ingredientIndex));

      const label = document.createElement("label");
      label.textContent = ingredient.name;

      // Create delete button for ingredient
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "×";
      deleteButton.classList.add("delete-ingredient");
      deleteButton.title = "Delete ingredient";
      deleteButton.onclick = (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        deleteIngredient(mealIndex, ingredientIndex);
      };

      ingredientItem.appendChild(checkbox);
      ingredientItem.appendChild(label);
      ingredientItem.appendChild(deleteButton);
      ingredientList.appendChild(ingredientItem);
    });

    mealSection.appendChild(mealHeader);
    mealSection.appendChild(ingredientList);
    groceryListDiv.appendChild(mealSection);
  });
}

// Populate meal options in the dropdown
function populateMealOptions() {
  const groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
  const mealSelect = document.getElementById("mealSelect");

  mealSelect.innerHTML = "";
  
  // Add a default "Select meal" option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select meal";
  mealSelect.appendChild(defaultOption);

  groceryList.forEach((meal, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = meal.mealName;
    mealSelect.appendChild(option);
  });
}

// Add a custom ingredient or selected ingredient
function addCustomIngredient() {
  const selectedMealIndex = document.getElementById("mealSelect").value;
  const newIngredientInput = document.getElementById("newIngredient");
  const ingredientDropdown = document.getElementById("ingredientDropdown");

  // Check if a new ingredient was entered or selected from the dropdown
  const newIngredient = newIngredientInput.value.trim() || ingredientDropdown.value;

  if (newIngredient && selectedMealIndex !== "") {
    const groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
    groceryList[selectedMealIndex].ingredients.push({ name: newIngredient, checked: false });
    localStorage.setItem("groceryList", JSON.stringify(groceryList));
    newIngredientInput.value = ""; // Clear the input field
    ingredientDropdown.value = ""; // Reset dropdown selection
    displayGroceryList();
  }
}

// Toggle ingredient status and update localStorage
function toggleIngredient(mealIndex, ingredientIndex) {
  const groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
  groceryList[mealIndex].ingredients[ingredientIndex].checked = !groceryList[mealIndex].ingredients[ingredientIndex].checked;
  localStorage.setItem("groceryList", JSON.stringify(groceryList));
  displayGroceryList();
}

// Delete a meal from the grocery list
function deleteMeal(mealIndex) {
  const groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
  groceryList.splice(mealIndex, 1);
  localStorage.setItem("groceryList", JSON.stringify(groceryList));
  displayGroceryList();
  populateMealOptions(); // Update meal options after deletion
}

// Updated deleteIngredient function with confirmation
function deleteIngredient(mealIndex, ingredientIndex) {
  const groceryList = JSON.parse(localStorage.getItem("groceryList")) || [];
  const ingredient = groceryList[mealIndex].ingredients[ingredientIndex];
  
  if (confirm(`Are you sure you want to delete "${ingredient.name}" from this meal?`)) {
    groceryList[mealIndex].ingredients.splice(ingredientIndex, 1);
    localStorage.setItem("groceryList", JSON.stringify(groceryList));
    displayGroceryList();
  }
}