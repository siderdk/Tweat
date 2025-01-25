
// getting the elements from the page (timers)
const topSection = document.querySelector('.top');
window.addEventListener('scroll', () => {
  topSection.style.top = '0';
  
});

// getting the elements from the page
const recipesContainer = document.querySelector('.recipesContainer');
const recipesSearchResults = document.querySelector('.search-results');
const recipeName = document.querySelector('.recipe_name');
const recipeImg = document.querySelector('.recipeImg');
const ingredientsList = document.querySelector('.ingredientsList');
const cookingSteps = document.querySelector('.cookingSteps');
const ingredientNumber = document.querySelector('.number-seach-input');
const keywordInput = document.querySelector('.keyword-seach-input');
const keywordSearchBtn = document.querySelector('.keyword-search-btn');
const ingredientSearchBtn = document.querySelector('.ingr-nbr-find-btn');
const timeCounterContainer = document.querySelector('.time-counter');
const timeCount = document.querySelector('.time-count');
const timerContainer = document.querySelector('.timer-container');
const minutesInput = document.querySelector('.time-amount-input');
const setTimerBtn = document.querySelector('.set-timer-btn');
const timerState = document.querySelector('.timer-state')
const addRecipeButton = document.querySelector('.addRecipeButton');
const addRecipeForm = document.querySelector('.addRecipeForm');

// the elements that will hold the new recipe
const newRecipeName = document.querySelector('.newRecipeName');
const newRecipeImg = document.querySelector('.newRecipeImage');
const newRecipeType = document.querySelector('.newRecipeType');


// the list of all recipes, will be an array of objects, to facilitate iteration and ordering
//the list of units that are used in the recipes
const unitTypes = {
    weight: ["g", "kg"],
    volume: ["ml", "dl", "l", "cup", "tbsp", "tsp"],
    counts: ["piece", "dozen", "bottle", "pack", "clove"]

    // shortcuts
    // g = unitTypes.weight[0] kg = unitTypes.weight[1]
    // ml = unitTypes.volume[0] ld =ml = unitTypes.volume[1] l = unitTypes.volume[2] cup = unitTypes.volume[3] tbsp = unitTypes.volume[4] tsp = unitTypes.volume[5] 
    // pieces = unitTypes.counts[0] dozen = unitTypes.counts[1]   bottle = unitTypes.counts[2] pack = unitTypes.counts[3] clove = unitTypes.counts[4]
};
//fetching the recipes 
let builtInRecipes = []
async function getRecipes() {
    const source = "https://raw.githubusercontent.com/siderdk/siderdk.github.io/refs/heads/main/api/tweatData.json";
    const response = await fetch(source);
    builtInRecipes = await response.json();
    return builtInRecipes;
}

// load user-created recipes from local storage
const userRecipesKey = "userRecipes";
const loadUserRecipes = () => {
    const storedRecipes = localStorage.getItem(userRecipesKey);
    return storedRecipes ? JSON.parse(storedRecipes) : [];
};

//consolidating all recipes in one list
const getAllRecipes = async () => {
    await getRecipes();
    const userRecipes = loadUserRecipes();
    return [...builtInRecipes, ...userRecipes];
};

getAllRecipes()
  .then((allRecipes) => {
    console.log("recipes fetched", allRecipes);
  })
  .catch((error) => {
    console.error("An error occurred while fetching recipes:", error);
  });

const allRecipes = await getAllRecipes();


//a function to render a preview card for each recipe inside a given container "parent"
async function renderRecipeCard (parent, recipe) { 
  parent.innerHTML = ""
  recipe.forEach((obj)=>{
  
      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-preview');
      
      const recipeTitle = document.createElement('h3');
      recipeTitle.innerText = obj.title;
      recipeCard.appendChild(recipeTitle);

      const recipeImage = document.createElement('img');
      recipeImage.src = obj.pictureLink;
      recipeImage.alt = obj.title;
      recipeCard.appendChild(recipeImage)    

      const recipePitch = document.createElement('p');
      recipePitch.innerText = obj.pitch;
      recipePitch.classList.add('pitch')
      recipeCard.appendChild(recipePitch);
      

      parent.appendChild(recipeCard);

      //making cards expand on click

      expandCollapseCard(recipeCard, obj);
  
  });
};

renderRecipeCard(recipesContainer, allRecipes);

// expand and collapse the recipe card
async function expandCollapseCard (recipeCard, obj) {
  recipeCard.addEventListener("click", ()=>{
    if (!recipeCard.querySelector('.ingredients') && !recipeCard.querySelector('.description')) {
      const recipePitch = recipeCard.querySelector('p');
      recipePitch.style.display = "none";
      recipeCard.style.height = "auto";
      recipeCard.style.width = "25rem";
      recipeCard.style.fontsize = "2rem";
      const ingredientsList = document.createElement('ul');
      ingredientsList.classList.add('ingredients'); 
      obj.ingredients.forEach((ingredient) => {
          const listItem = document.createElement('li');
          if (ingredient.amount > 0) {listItem.innerText = `${ingredient.amount || ""} ${ingredient.unit || ""} of ${ingredient.name}`
            } else {listItem.innerText = `${ingredient.name}: to taste`};
          
          ingredientsList.appendChild(listItem);
          listItem.style.margin = "0.2rem";

      });
      
      recipeCard.appendChild(ingredientsList);
      ingredientsList.style.margin = "0.5rem";

      const recipeDescription = document.createElement('fieldset');
      recipeDescription.innerHTML = `<legend>Description </legend> 
      <div class="steps">${obj.description}</div>`;
      recipeDescription.classList.add('description'); 
      recipeCard.appendChild(recipeDescription);

      const addToListBtn = document.createElement('button');
      addToListBtn.innerText = 'Add to shopping list';
      addToListBtn.classList.add('add-to-list-button'); 
      recipeCard.appendChild(addToListBtn);

      const collapseButton = document.createElement('button');
      collapseButton.innerText = 'Collapse';
      collapseButton.classList.add('collapse-button'); 
      recipeCard.appendChild(collapseButton);
    
      recipeCard.style.position = "fixed";
      recipeCard.style.top = "50%";
      recipeCard.style.left = "50%";
      recipeCard.style.transform = "translate(-50%, -50%)";
      recipeCard.style.zIndex = "3";
      // Create and style the overlay
      const overlay = document.createElement('div');
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; 
      overlay.style.zIndex = "1"; // Behind the card
      document.body.appendChild(overlay);

      //if the recipe is editable, add an edit button and delete button
      if (obj.edit) {
        const editButton = document.createElement('a');
        editButton.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 106.86 122.88" style="enable-background:new 0 0 106.86 122.88" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" d="M39.62,64.58c-1.46,0-2.64-1.41-2.64-3.14c0-1.74,1.18-3.14,2.64-3.14h34.89c1.46,0,2.64,1.41,2.64,3.14 c0,1.74-1.18,3.14-2.64,3.14H39.62L39.62,64.58z M46.77,116.58c1.74,0,3.15,1.41,3.15,3.15c0,1.74-1.41,3.15-3.15,3.15H7.33 c-2.02,0-3.85-0.82-5.18-2.15C0.82,119.4,0,117.57,0,115.55V7.33c0-2.02,0.82-3.85,2.15-5.18C3.48,0.82,5.31,0,7.33,0h90.02 c2.02,0,3.85,0.83,5.18,2.15c1.33,1.33,2.15,3.16,2.15,5.18v50.14c0,1.74-1.41,3.15-3.15,3.15c-1.74,0-3.15-1.41-3.15-3.15V7.33 c0-0.28-0.12-0.54-0.31-0.72c-0.19-0.19-0.44-0.31-0.72-0.31H7.33c-0.28,0-0.54,0.12-0.73,0.3C6.42,6.8,6.3,7.05,6.3,7.33v108.21 c0,0.28,0.12,0.54,0.3,0.72c0.19,0.19,0.45,0.31,0.73,0.31H46.77L46.77,116.58z M98.7,74.34c-0.51-0.49-1.1-0.72-1.78-0.71 c-0.68,0.01-1.26,0.27-1.74,0.78l-3.91,4.07l10.97,10.59l3.95-4.11c0.47-0.48,0.67-1.1,0.66-1.78c-0.01-0.67-0.25-1.28-0.73-1.74 L98.7,74.34L98.7,74.34z M78.21,114.01c-1.45,0.46-2.89,0.94-4.33,1.41c-1.45,0.48-2.89,0.97-4.33,1.45 c-3.41,1.12-5.32,1.74-5.72,1.85c-0.39,0.12-0.16-1.48,0.7-4.81l2.71-10.45l0,0l20.55-21.38l10.96,10.55L78.21,114.01L78.21,114.01 z M39.62,86.95c-1.46,0-2.65-1.43-2.65-3.19c0-1.76,1.19-3.19,2.65-3.19h17.19c1.46,0,2.65,1.43,2.65,3.19 c0,1.76-1.19,3.19-2.65,3.19H39.62L39.62,86.95z M39.62,42.26c-1.46,0-2.64-1.41-2.64-3.14c0-1.74,1.18-3.14,2.64-3.14h34.89 c1.46,0,2.64,1.41,2.64,3.14c0,1.74-1.18,3.14-2.64,3.14H39.62L39.62,42.26z M24.48,79.46c2.06,0,3.72,1.67,3.72,3.72 c0,2.06-1.67,3.72-3.72,3.72c-2.06,0-3.72-1.67-3.72-3.72C20.76,81.13,22.43,79.46,24.48,79.46L24.48,79.46z M24.48,57.44 c2.06,0,3.72,1.67,3.72,3.72c0,2.06-1.67,3.72-3.72,3.72c-2.06,0-3.72-1.67-3.72-3.72C20.76,59.11,22.43,57.44,24.48,57.44 L24.48,57.44z M24.48,35.42c2.06,0,3.72,1.67,3.72,3.72c0,2.06-1.67,3.72-3.72,3.72c-2.06,0-3.72-1.67-3.72-3.72 C20.76,37.08,22.43,35.42,24.48,35.42L24.48,35.42z"/></g></svg>`;
        editButton.classList.add('edit-recipe-btn');
        recipeCard.appendChild(editButton);
        const deleteButton = document.createElement('a');
        deleteButton.innerHTML = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110.61 122.88"><title>trash</title><path d="M39.27,58.64a4.74,4.74,0,1,1,9.47,0V93.72a4.74,4.74,0,1,1-9.47,0V58.64Zm63.6-19.86L98,103a22.29,22.29,0,0,1-6.33,14.1,19.41,19.41,0,0,1-13.88,5.78h-45a19.4,19.4,0,0,1-13.86-5.78l0,0A22.31,22.31,0,0,1,12.59,103L7.74,38.78H0V25c0-3.32,1.63-4.58,4.84-4.58H27.58V10.79A10.82,10.82,0,0,1,38.37,0H72.24A10.82,10.82,0,0,1,83,10.79v9.62h23.35a6.19,6.19,0,0,1,1,.06A3.86,3.86,0,0,1,110.59,24c0,.2,0,.38,0,.57V38.78Zm-9.5.17H17.24L22,102.3a12.82,12.82,0,0,0,3.57,8.1l0,0a10,10,0,0,0,7.19,3h45a10.06,10.06,0,0,0,7.19-3,12.8,12.8,0,0,0,3.59-8.1L93.37,39ZM71,20.41V12.05H39.64v8.36ZM61.87,58.64a4.74,4.74,0,1,1,9.47,0V93.72a4.74,4.74,0,1,1-9.47,0V58.64Z"/></svg>`;
        deleteButton.classList.add('delete-recipe-btn');
        recipeCard.appendChild(deleteButton);
      }


      // Make a card collapse
      collapseButton.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent triggering the card click event
          ingredientsList.remove();
          recipeDescription.remove();
          collapseButton.remove();
          addToListBtn.remove();
          recipeCard.style.width = "15rem";
          recipePitch.style.display = "unset";
          recipeCard.style.transform = "";
          recipeCard.style.position = "";
          recipeCard.style.top = "";
          recipeCard.style.left = "";
          recipeCard.style.zIndex = "";
          document.body.removeChild(overlay);

          // Remove the edit and delete buttons if they exist (for some reason I have to redifine them because the console says they are out of scope)
          if (obj.edit) {
             const editButton = recipeCard.querySelector('.edit-recipe-btn');
             editButton.remove();
             const deleteButton = recipeCard.querySelector('.delete-recipe-btn');
             deleteButton.remove();
          }
          
      });
}
  })
};

//find recipes by number of ingredients and render them
const getRecipeByIngredientNbr = (recipeslist, num)=>{
  const foundRecipes = [];
  recipeslist.forEach((recipe)=>{
      if(recipe.ingredients.length===num) {
          foundRecipes.push(recipe);
      }
  })
  return foundRecipes;
}

ingredientSearchBtn.addEventListener("click", (e)=> {
  const regex = /^(|[^0-9]|[0-9]*[^0-9]|)$/; // regex to check if the input is a  positive number
  const str = ingredientNumber.value
  const num = parseInt(str.replace(regex, "")); // parsing the number from the input
  const result = getRecipeByIngredientNbr(allRecipes, num);
  if (num===0) {renderRecipeCard(recipesContainer, allRecipes)} else {renderRecipeCard(recipesContainer, result)}
  ;

})

// finding recipes by keywords
const getRecipeByKeyword = (recipesList, str) =>{
  const foundRecipes = [];
  //If I understand regex correctly, this is supposed to catch anything that is not a space or a letter
  const regex = /[^a-zA-Z\s]/g; 
  const cleanStr = str.replace(regex, "").toLowerCase();
  //handling empty inputs
  if (!cleanStr.trim()) { 
      return allRecipes;  
  } else {
  recipesList.forEach((recipe)=>{
      let found = false;
      for (const key in recipe) {
          const value = recipe[key];
          // check for each value if it's a string 
          if (typeof value === "string" && value.includes(cleanStr)){
              found = true;
              break 
          };
          // check for the value if it's an array to handle the case of ingredients
          if ( Array.isArray(value)) {
              value.forEach((ingredientsList)=>{
                  for (const ingredientIndex in ingredientsList){
                      const ingredient = ingredientsList[ingredientIndex]
                      if (ingredient.includes(cleanStr)){
                          found = true;
                          break
                      }
                  }
              })
          }
      }
      if (found) {
          foundRecipes.push(recipe)
      }
  });
  return foundRecipes
}
}

keywordSearchBtn.addEventListener("click", async (e)=>{
 /* recipesSearchResults.innerHTML = ""*/
  const result = getRecipeByKeyword(allRecipes, keywordInput.value);
  renderRecipeCard(recipesContainer, result);

} )


//user timer 
const TimeIsUp = ()=> {
  alert('The timer is Up!!!')
}

setTimerBtn.addEventListener("click", ()=>{
  const timeAmount = Math.sqrt((parseInt(minutesInput.value) ** 2))
  const timeInMlSec = timeAmount * 60000 // converting the amount of time to milliseconds
  timerState.textContent = `A timer has been set for ${timeAmount} minutes`;
  setTimeout(()=>{
          alert("The time is up!");
          timerState.textContent = "";
          minutesInput.value = ""
      }, timeInMlSec);
  
});

// total time on the page 
const timeCounter = () => {
  const startTime = new Date(); // Record the time the user starts visiting the page

  setInterval(() => {
      const currentTime = new Date(); // Get the current time
      const timeElapsed = Math.floor((currentTime - startTime) / 1000); // Time difference in seconds

      // Convert the elapsed time to minutes and seconds
      const seconds = timeElapsed % 60;
      const minutes = Math.floor(timeElapsed / 60);

      // Update the display

    if (timeElapsed <59) {
      timeCount.innerText = `${seconds} seconds`;
    } else if (timeElapsed > 59 && timeElapsed < 119) {
      timeCount.innerText = `${minutes} minute and ${seconds} seconds`
    } else if (timeElapsed >= 120){timeCount.innerText = `${minutes} minutes and ${seconds} seconds`}
      // Alert if user has been on the page for more than an hour
      if (minutes > 59) {
          alert("There is no way you are on this page for this long! Thank you for your attention");
      }
  }, 1000); // Run every second
};

// Start the count
timeCounter();


//adding a recipe functionality

//the object that will hold the new recipe 
let newRecipe = {
  id : Date.now(),
  title: "",
  pictureLink: "",
  type: "",
  pitch: "",
  ingredients: [],
  description: "",
  edit: true
};
//  a function to save recipes to local storage
const saveUserRecipes = (recipes) => {
  localStorage.setItem(userRecipesKey, JSON.stringify(recipes));
};

//a function to add a new recipe to the list of recipes
const addNewRecipe = (newRecipe) => {
  const userRecipes = loadUserRecipes();
  userRecipes.push(newRecipe);
  saveUserRecipes(userRecipes);
};


// showing the form to add a new recipe
addRecipeButton.addEventListener('click', ()=>{
  if(addRecipeButton.innerText === "Add your recipe to the list") {
    addRecipeButton.innerText = "Hide the form";
    addRecipeButton.style.background = "rgba(0, 0, 0, 0.75)";
  } else {
    addRecipeButton.innerText = "Add your recipe to the list"
    addRecipeButton.style.background = "linear-gradient(90deg, #036f11, #6fca3a)";
  };
  addRecipeForm.classList.toggle("hidden")

});




  
function addRecipe() {
  
  
}