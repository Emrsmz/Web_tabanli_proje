/*
Vodka Soda → Vodka + Lime Juice + Soda Water
Gin Sour → Gin + Lemon Juice + Simple Syrup
Daiquiri → Rum + Lime Juice + Simple Syrup
Kamikaze → Vodka + Triple Sec + Lime Juice
Gin Rickey → Gin + Soda Water + Lime Juice
White Lady → Rum + Triple Sec + Lemon Juice
*/ 

const recipes = [
  {
    ingredients: ["Base", "Lime Juice","Soda Water"],
    result: "Vodka Soda",
    color: "#9b59b6"
  },
  {
    ingredients: ["Base", "Lemon Juice","Simple Syrup"],
    result: "Gin Sour",
    color: "#e74c3c"
  },
  {
    ingredients: ["Base", "Lime Juice","Simple Syrup"],
    result: "Daiquiri",
    color: "#9b59b6"
  },
  {
    ingredients: ["Base", "Triple Sec","Lime Juice"],
    result: "Kamikaze",
    color: "#9b59b6"
  },
  {
    ingredients: ["Base", "Soda Water","Lime Juice"],
    result: "Gin Rickey",
    color: "#9b59b6"
  },
  {
    ingredients: ["Base", "Triple Sec","Lemon Juice"],
    result: "White Lady",
    color: "#9b59b6"
  }
];

let currentMix = [];

function toggleBook() {
  const book = document.getElementById('recipeBook');
  book.classList.toggle('hidden');
}

document.getElementById('mixBtn').addEventListener('click', () => {
    // 1. Sort the current items alphabetically
    const sortedMix = [...currentMix].sort();

    // 2. Find a matching recipe
    const match = recipes.find(recipe => {
        return JSON.stringify(recipe.ingredients.sort()) === JSON.stringify(sortedMix);
    });

    if (match) {
        alert("Success! You created: " + match.result);
        // Reset table after success
        currentMix = [];
    } else {
        console.log("Nothing happens...");
        // Optionally: clear the table or show a "failed" animation
    }
});