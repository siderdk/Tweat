const recipeObject = {
    id: 1,
    title: "Gløgg",
    pictureLink:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Gl%C3%B6gg_kastrull.JPG/800px-Gl%C3%B6gg_kastrull.JPG",
    ingredients: [
      { name: "Orange zest", amount: "0.5" },
      { name: "Water", amount: "200 ml" },
      { name: "Sugar", amount: "275 g" },
      { name: "Whole cloves", amount: "5" },
      { name: "Cinnamon sticks", amount: "2" },
      { name: "Spice", amount: undefined },
      { name: "Bottle of red wine", amount: "1" },
      { name: "Raisins", amount: "100 g" },
      { name: "Slipped Almonds", amount: "50 g" },
    ],
    description: "Mix everything, heat it, and you are good to go!",
  };

// getting the elements from the page
const recipeName = document.querySelector('.recipe_name')
const recipeImg = document.querySelector('.recipeImg')
const ingredientsList = document.querySelector('.ingredientsList')
const cookingSteps = document.querySelector('.cookingSteps')

// linking the elements to the recipe's object

recipeName.innerText = recipeObject.title
recipeImg.src = recipeObject.pictureLink

for (let element of recipeObject.ingredients) {
    const listItem = document.createElement('li')
    listItem.innerText = `${element.amount} of ${element.name}`;
    ingredientsList.appendChild(listItem)
}

cookingSteps.innerText = recipeObject.description

// user added recipe section
let newRecipeObject = {
    id: 0,
    title: "",
    picture_url:
      "",
    ingredients: [],
    description: "",
}

const addRecipeButton = document.querySelector('.addRecipeButton')

addRecipeButton.addEventListener('click', addRecipe)

// adding a recipe function
function addRecipe(event) {
    const parent = event.target.parentNode
    const newRecipeDiv = document.createElement('div');
    newRecipeDiv.classList.add('NewRecipeContainer'); 
    const HTMLString = `
    <br>
    <label for="newRecipeName">Name</label>
    <input type="text" id="newRecipeName" placeholder="Give your recipe a name" />
    <button class="addNameButton">Add</button>
    `;
    parent.insertAdjacentHTML('beforeend', HTMLString);
    const addNewName = document.querySelector('.addNameButton')
    addNewName.addEventListener('click', addName)
    
}

function addName(event){
    const parent = event.target.parentNode
    const nameInput = document.querySelector('#newRecipeName');
    newRecipeObject.title = nameInput.value 
    const HTMLString = `
    <br>
    <label for="ingredient1">Add ingredient</label>
    <input type="text" id="ingredient1" placeholder="ingredient name"/><input id="amount1" type="number" min="0" max="9999" placeholder="amount"/><label for="unit1">unit</label><select id="unitDropDown"><option value="gr" selected>grams</option><option value="dl">dl</option><option value="cup">cup</option><option value="units">units</option></select>
    <button class="addIngredient">Add</button><br>
    <button class="addDescription">Add description</button>
    `
    parent.insertAdjacentHTML('beforeend', HTMLString);
    const addNewIngredient = document.querySelector('.addIngredient')
    addNewIngredient.addEventListener('click', addIngredient)
}

function addIngredient(event) {
    const ingredientNameInput = document.querySelector('#ingredient1');
    const ingredientAmountInput = document.querySelector('#amount1');
    const ingredientUnitInput = document.querySelector('#unitDropDown');

    const newIngredient = {
        name: ingredientNameInput.value,
        amount: `${ingredientAmountInput.value} ${ingredientUnitInput.value}`
    };

    newRecipeObject.ingredients.push(newIngredient);
 
    console.log(newRecipeObject.ingredients);
}


// const builtInRecipes = [
//     {
//     id: "glogg00001",
//     title: "Gløgg",
//     pictureLink: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Gl%C3%B6gg_kastrull.JPG/800px-Gl%C3%B6gg_kastrull.JPG",
//     type: "Dinner",
//     pitch: "easy sweet and spicy mulled wine",
//     ingredients: [
//           { name: "Orange zest", amount: "0.5", unit: unitTypes.counts[0] },
//           { name: "Water", amount: "200", unit: unitTypes.volume[0] },
//           { name: "Sugar", amount: "275", unit: unitTypes.weight[0] },
//           { name: "Whole cloves", amount: "5", unit: unitTypes.counts[0] },
//           { name: "Cinnamon sticks", amount: "2", unit: unitTypes.counts[0] },
//           { name: "Spice", amount: "0" }, // the amount of 0 should be later referenced to render "to taste" in the browser 
//           { name: "Red wine", amount: "1", unit: unitTypes.counts[2] },
//           { name: "Raisins", amount: "100", unit: unitTypes.weight[0] },
//           { name: "Slipped Almonds", amount: "50", unit: unitTypes.weight[0] },
//         ],
//     description: "Mix everything, heat it, and you are good to go!"},
    
//     {
//     id: "bnizen00002",
//     title: "Bniwen",
//     pictureLink: "https://lifestyleofafoodie.com/wp-content/uploads/2020/05/Almond-no-bake-energy-balls-with-chocolate-crunch-13-of-18.jpg",
//     type: "Dessert",
//     pitch: "delightful and easy, guaranteed happiness with each bite",
//     ingredients: [
//           { name: "crackers", amount: "1", unit:  unitTypes.volume[3] },
//           { name: "butter", amount: "0.75", unit: unitTypes.volume[3] },
//           { name: "Vanilla sugar", amount: "3", unit: unitTypes.volume[4] },
//           { name: "Turkish halva", amount: "0.75", unit: unitTypes.volume[3] },
//           { name: "Almond flour", amount: "0.5", unit: unitTypes.volume[3] },
//           { name: "Nut mix", amount: "0.5", unit: unitTypes.volume[3] },
//           { name: "Licorice pulver", amount: "1", unit: unitTypes.volume[4] },
//           { name: "Cocoa pulver", amount: "3", unit: unitTypes.volume[4] },
//           { name: "Dark chocolate", amount: "120", unit: unitTypes.weight[0] },
          
//         ],
//     description: "Process the nuts. Mix everything, cover in melted chocolate, and you are good to go!",},
//     {
//         id: "lasgn00003",
//         title: "Classic Lasagna",
//         pictureLink: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Lasagna_%28cropped%29.jpg",
//         type: "Dinner",
//         pitch: "Rich and cheesy layers of goodness",
//         ingredients: [
//             { name: "Lasagna noodles", amount: "12", unit: unitTypes.counts[0] },
//             { name: "Ground beef", amount: "500", unit: unitTypes.weight[0] },
//             { name: "Tomato sauce", amount: "2", unit: unitTypes.volume[3] },
//             { name: "Ricotta cheese", amount: "1", unit: unitTypes.volume[3] },
//             { name: "Mozzarella cheese", amount: "2", unit: unitTypes.volume[3] },
//             { name: "Parmesan cheese", amount: "0.5", unit: unitTypes.volume[3] },
//             { name: "Onion", amount: "1", unit: "" },
//             { name: "Garlic", amount: "2", unit: unitTypes.counts[4] },
//             { name: "Olive oil", amount: "2", unit: unitTypes.volume[4] },
//         ],
//         description: "Layer noodles, meat sauce, and cheeses. Bake until bubbly and golden.",
//     },
//     {
//         id: "ratat00004",
//         title: "Ratatouille",
//         pictureLink: "https://upload.wikimedia.org/wikipedia/commons/2/27/Ratatouille.jpg",
//         type: "Lunch",
//         pitch: "A healthy French veggie medley",
//         ingredients: [
//             { name: "Eggplant", amount: "1", unit: "" },
//             { name: "Zucchini", amount: "1", unit: "" },
//             { name: "Bell peppers", amount: "2", unit: "" },
//             { name: "Tomatoes", amount: "3", unit: "" },
//             { name: "Garlic", amount: "2", unit: unitTypes.counts[4] },
//             { name: "Olive oil", amount: "3", unit: unitTypes.volume[4] },
//             { name: "Thyme", amount: "1", unit: unitTypes.volume[5] },
//             { name: "Salt", amount: "0", unit: "" },
//             { name: "Pepper", amount: "0", unit: "" },
//         ],
//         description: "Sauté vegetables, layer them in a dish, and bake until tender.",
//     },
//     {
//         id: "pesto00005",
//         title: "Pesto Pasta",
//         pictureLink: "https://upload.wikimedia.org/wikipedia/commons/8/81/Pesto_pasta.jpg",
//         type: "Lunch",
//         pitch: "Simple and refreshing Italian flavors",
//         ingredients: [
//             { name: "Pasta", amount: "250", unit: unitTypes.weight[0] },
//             { name: "Basil leaves", amount: "2", unit: unitTypes.volume[3] },
//             { name: "Pine nuts", amount: "2", unit: unitTypes.volume[4] },
//             { name: "Garlic", amount: "1", unit: unitTypes.counts[4] },
//             { name: "Parmesan cheese", amount: "0.5", unit: unitTypes.volume[3] },
//             { name: "Olive oil", amount: "0.25", unit: unitTypes.volume[3] },
//             { name: "Salt", amount: "0", unit: "" },
//             { name: "Pepper", amount: "0", unit: "" },
//         ],
//         description: "Blend pesto ingredients, mix with cooked pasta, and serve.",
//     },
//     {
//         id: "tirsm00006",
//         title: "Tiramisu",
//         pictureLink: "https://upload.wikimedia.org/wikipedia/commons/0/04/Tiramisu_with_spoon.jpg",
//         type: "Dessert",
//         pitch: "The classic creamy Italian delight",
//         ingredients: [
//             { name: "Ladyfingers", amount: "300", unit: unitTypes.weight[0] },
//             { name: "Mascarpone cheese", amount: "500", unit: unitTypes.weight[0] },
//             { name: "Espresso", amount: "2", unit: unitTypes.volume[3] },
//             { name: "Cocoa powder", amount: "2", unit: unitTypes.volume[4] },
//             { name: "Egg yolks", amount: "4", unit: "" },
//             { name: "Sugar", amount: "0.5", unit: unitTypes.volume[3] },
//             { name: "Whipping cream", amount: "1", unit: unitTypes.volume[3] },
//         ],
//         description: "Layer mascarpone cream and coffee-dipped ladyfingers. Chill and dust with cocoa.",
//     },
//     {
//         id: "shak00007",
//         title: "Shakshuka",
//         pictureLink: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shakshouka.jpg",
//         type: "Breakfast",
//         pitch: "A hearty and flavorful breakfast dish",
//         ingredients: [
//             { name: "Eggs", amount: "4", unit: "" },
//             { name: "Tomatoes", amount: "4", unit: "" },
//             { name: "Bell pepper", amount: "1", unit: "" },
//             { name: "Onion", amount: "1", unit: "" },
//             { name: "Garlic", amount: "2", unit: unitTypes.counts[4] },
//             { name: "Olive oil", amount: "2", unit: unitTypes.volume[4] },
//             { name: "Cumin", amount: "1", unit:unitTypes.volume[5] },
//             { name: "Paprika", amount: "1", unit: unitTypes.volume[5] },
//             { name: "Cilantro", amount: "0", unit: "" },
//         ],
//         description: "Cook vegetables in a skillet, add eggs, and let them cook to desired doneness.",
//     },
//     {
//         id: "cckch00008",
//         title: "Chocolate Chip Cookies",
//         pictureLink: "https://upload.wikimedia.org/wikipedia/commons/6/69/Chocolate_Chip_Cookies_-_kimberlykv.jpg",
//         type: "Dessert",
//         pitch: "Soft and chewy, a timeless classic",
//         ingredients: [
//             { name: "Butter", amount: "1", unit: unitTypes.volume[3] },
//             { name: "Sugar", amount: "1", unit: unitTypes.volume[3] },
//             { name: "Brown sugar", amount: "1", unit: unitTypes.volume[3] },
//             { name: "Eggs", amount: "2", unit: "" },
//             { name: "Vanilla extract", amount: "1", unit: unitTypes.volume[5] },
//             { name: "Flour", amount: "2.5", unit: unitTypes.volume[3] },
//             { name: "Baking soda", amount: "1", unit: unitTypes.volume[5] },
//             { name: "Salt", amount: "0.5", unit: unitTypes.volume[5] },
//             { name: "Chocolate chips", amount: "2", unit: unitTypes.volume[3] },
//         ],
//         description: "Mix wet and dry ingredients, fold in chocolate chips, and bake until golden.",
//     },
//     {
//         id: "ramen00009",
//         title: "Ramen Noodles",
//         pictureLink: "https://upload.wikimedia.org/wikipedia/commons/3/39/Ramen_by_guilhem_vellut.jpg",
//         type: "Lunch",
//         pitch: "Quick and satisfying noodle bowl",
//         ingredients: [
//             { name: "Ramen noodles", amount: "2", unit: "packs" },
//             { name: "Chicken broth", amount: "4", unit: unitTypes.volume[3] },
//             { name: "Soy sauce", amount: "2", unit: unitTypes.volume[4] },
//             { name: "Ginger", amount: "1", unit: unitTypes.volume[5]},
//             { name: "Garlic", amount: "2", unit: unitTypes.counts[4] },
//             { name: "Eggs", amount: "2", unit: "" },
//             { name: "Green onions", amount: "2", unit: "" },
//             { name: "Sesame oil", amount: "1", unit: unitTypes.volume[5] },
//         ],
//         description: "Simmer broth, add noodles, and top with eggs and green onions.",
//     },
//     {
//         id: "pcklz00010",
//         title: "Pickled Vegetables",
//         pictureLink: "https://upload.wikimedia.org/wikipedia/commons/1/19/Japanese_picked_vegetables.jpg",
//         type: "Side Dish",
//         pitch: "Crisp, tangy, and versatile",
//         ingredients: [
//             { name: "Cucumber", amount: "1", unit: "" },
//             { name: "Carrots", amount: "2", unit: "" },
//             { name: "Vinegar", amount: "1", unit: unitTypes.volume[3] },
//             { name: "Water", amount: "1", unit: unitTypes.volume[3] },
//             { name: "Sugar", amount: "2", unit: unitTypes.volume[4] },
//             { name: "Salt", amount: "1", unit: unitTypes.volume[5] },
//             { name: "Garlic", amount: "1", unit: unitTypes.counts[4] },
//         ],
//         description: "Mix brine ingredients, pour over sliced vegetables, and refrigerate.",
//     },
//     {
//         id: "pancake0011",
//         title: "Pancakes",
//         pictureLink: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Pancakes_with_maple_syrup.jpg",
//         type: "Breakfast",
//         pitch: "Fluffy and delicious, perfect for mornings",
//         ingredients: [
//             { name: "Flour", amount: "1", unit: unitTypes.volume[3] },
//             { name: "Milk", amount: "1", unit: unitTypes.volume[3] },
//             { name: "Egg", amount: "1", unit: "" },
//             { name: "Baking powder", amount: "1", unit: unitTypes.volume[5] },
//             { name: "Sugar", amount: "2", unit: unitTypes.volume[4] },
//             { name: "Butter", amount: "2", unit: unitTypes.volume[4] },
//             { name: "Salt", amount: "0.25", unit: unitTypes.volume[5] },
//         ],
//         description: "Mix ingredients, pour batter onto a skillet, and cook until golden brown.",
//     },
//     {
//         id: "smooth00012",
//         title: "Berry Smoothie",
//         pictureLink: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Smoothie.jpg",
//         type: "Drink",
//         pitch: "Refreshing and packed with nutrients",
//         ingredients: [
//             { name: "Mixed berries", amount: "1", unit: unitTypes.volume[3] },
//             { name: "Banana", amount: "1", unit: "" },
//             { name: "Greek yogurt", amount: "0.5", unit: unitTypes.volume[3] },
//             { name: "Milk", amount: "1", unit: unitTypes.volume[3] },
//             { name: "Honey", amount: "1", unit: unitTypes.volume[4] },
//         ],
//         description: "Blend all ingredients together until smooth and creamy.",
//     }
    
// ]