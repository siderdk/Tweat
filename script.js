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
const durationUnit = document.querySelector('.duration-unit')
const timerContainer = document.querySelector('.timer-container');
const minutesInput = document.querySelector('.time-amount-input');
const setTimerBtn = document.querySelector('.set-timer-btn');
const timerState = document.querySelector('.timer-state')

//load previous added recipes from local storage, or initialize an empty list in case this is used for the first time
const userRecipes = JSON.parse(localStorage.getItem("data")) || [];
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

//getting userRecipes from local storage
const userRecipesKey = "userRecipes"; // Key for local storage

// Load user-created recipes from local storage
const loadUserRecipes = () => {
    const storedRecipes = localStorage.getItem(userRecipesKey);
    return storedRecipes ? JSON.parse(storedRecipes) : [];
};

//consolidating all recipes in one list
const getAllRecipes = () => {
    const userRecipes = loadUserRecipes();
    return [...builtInRecipes, ...userRecipes];
  };

//fetching the recipes and rendering them
let builtInRecipes = []
async function getRecipes() {
    const source = "https://raw.githubusercontent.com/siderdk/siderdk.github.io/refs/heads/main/api/tweatData.json" ;
    const response = await fetch(source);
    builtInRecipes = await response.json();
    const allRecipes = getAllRecipes();
    renderRecipeCard(recipesContainer, getAllRecipes());
    return allRecipes
}
getRecipes();



//a function to render a preview card for each recipe inside a given container "parent"
const renderRecipeCard = (parent, array) =>{ 
    parent.innerHTML = ""
    array.forEach((obj)=>{
    
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
        recipeCard.appendChild(recipePitch);

        

        parent.appendChild(recipeCard)

    //making cards expand on click
            recipeCard.addEventListener("click", ()=>{
                if (!recipeCard.querySelector('.ingredients') && !recipeCard.querySelector('.description')) {
                    const ingredientsList = document.createElement('ul');
                    ingredientsList.classList.add('ingredients'); 
                    obj.ingredients.forEach((ingredient) => {
                        const listItem = document.createElement('li');
                        listItem.innerText = ingredient.amount > 0 
                            ? `${ingredient.amount || ""} ${ingredient.unit || ""} of ${ingredient.name}`
                            : `${ingredient.name}: to taste`;
                        ingredientsList.appendChild(listItem);
                    });
                    recipeCard.appendChild(ingredientsList);

                    const recipeDescription = document.createElement('p');
                    recipeDescription.innerText = `Description: ${obj.description}`;
                    recipeDescription.classList.add('description'); 
                    recipeCard.appendChild(recipeDescription);

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
                    });
        }
            })

    
    })
}


//find recipes by number of ingredients
const getRecipeByIngredientNbr = (array, num)=>{
    const foundRecipes = [];
    array.forEach((obj)=>{
        if(obj.ingredients.length===num) {
            foundRecipes.push(obj);
        }
    })
    return foundRecipes;
}


ingredientSearchBtn.addEventListener("click", async (e)=> {
    const num = Math.sqrt((parseInt(ingredientNumber.value) ** 2)); // get a positive int out of num
    const allRecipes = await getRecipes();
    const result = getRecipeByIngredientNbr(allRecipes, num);
    renderRecipeCard(recipesSearchResults, result);

})



// finding recipes by keywords
const getRecipeByKeyword = (array, str) =>{
    const foundRecipes = [];
    //If I understand regex correctly, this is supposed to catch anything that is not a space or a letter
    const regex = /[^a-zA-Z\s]/g; 
    const cleanStr = str.replace(regex, "").toLowerCase();
    //handling empty inputs
    if (!cleanStr.trim()) { 
        alert("Please enter a valid keyword.");
        return;  
    };
    array.forEach((obj)=>{
        let found = false;
        for (const key in obj) {
            const value = obj[key];
            // check for each value if it's a string 
            if (typeof value === "string" && value.includes(cleanStr)){
                found = true;
                break 
            };
            // check for the value if it's an array to handle the case of ingredients
            if ( Array.isArray(value)) {
                value.forEach((element)=>{
                    for (const elementKey in element){
                        const elementValue = element[elementKey]
                        if (elementValue.includes(cleanStr)){
                            found = true;
                            break
                        }
                    }
                })
            }
        }
        if (found) {
            foundRecipes.push(obj)
        }
    });
    return foundRecipes

}

keywordSearchBtn.addEventListener("click", async (e)=>{
    recipesSearchResults.innerHTML = ""
    const allRecipes = await getRecipes();
    result = getRecipeByKeyword(allRecipes, keywordInput.value);
    renderRecipeCard(recipesSearchResults, result);

} )


//time counter function
const timeCounter= ()=>{
    let seconds = 0; 
    setInterval(()=>{
    
        seconds++;
        timeCount.innerText = seconds;
        durationUnit.textContent = " seconds";
        if (seconds>59){
            timeCount.innerText = seconds%60;
            let minutes = Math.floor(seconds/60);
            durationUnit.textContent = ` seconds and ${minutes} minutes`;
            if(minutes > 59){
                alert('There is no way you are on this page for this long! Thank you for your attention');
            };
        };
    }, 1000);
    
};
//start the count
timeCounter();

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
    

})


