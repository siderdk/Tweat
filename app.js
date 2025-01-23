
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
      addToListBtn.innerText = 'Add to list';
      addToListBtn.classList.add('add-to-list-button'); 
      recipeCard.appendChild(addToListBtn);

      const collapseButton = document.createElement('button');
      collapseButton.innerText = 'Collapse';
      collapseButton.classList.add('collapse-button'); 
      recipeCard.appendChild(collapseButton);
    

      // Make a card collapse
      collapseButton.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent triggering the card click event
          ingredientsList.remove();
          recipeDescription.remove();
          collapseButton.remove();
          addToListBtn.remove();
          recipeCard.style.width = "15rem";
          recipePitch.style.display = "unset";
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
    } else if (timeElapsed > 59) {
      timeCount.innerText = `${minutes} minute and ${seconds} seconds`
    } else {timeCount.innerText = `${minutes} minutes and ${seconds} seconds`}
      // Alert if user has been on the page for more than an hour
      if (minutes > 59) {
          alert("There is no way you are on this page for this long! Thank you for your attention");
      }
  }, 1000); // Run every second
};

// Start the count
timeCounter();