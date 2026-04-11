const drinkImages = {};

const DRINKS = [
    { id: "margarita", label: "Margarita",
    ingredients: ["alcohol", "lime", "orange"],
    image: "./Resimler/margarita.png"
    },
    { id: "mojito",    label: "Mojito",
    ingredients: ["alcohol", "lime", "mint", "soda", "sugar"],
    image:"./Resimler/mojito.png"
    },
];

DRINKS.forEach(drink => {
    const img = new image();
    img.src = drink.image();
    drinkImages[drink.id] = img;
})





































