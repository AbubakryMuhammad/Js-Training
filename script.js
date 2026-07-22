// Get customer details
let customerName = prompt("Enter your name:");
let customerAge = Number(prompt("Enter your age:"));
let budget = Number(prompt("Enter your budget (₦):"));
let hasReservation = prompt("Do you have a reservation? (yes/no)").toLowerCase() === "yes";

// Dish prices
let jollofRice = 5000;
let grilledChicken = 8000; 
let seafoodPlatter = 12000; 

// Check if customer is old enough
let isOldEnough = customerAge >= 18;

// Check if customer can afford at least one dish
let canAfford =
    budget >= jollofRice ||
    budget >= grilledChicken ||
    budget >= seafoodPlatter;

// Display results
if (isOldEnough) {
    console.log("You are old enough to dine.");
} else {
    console.log("Sorry, you must be at least 18 years old to dine.");
}

if (canAfford) {
    console.log("You can afford at least one dish.");
} else {
    console.log("Sorry, your budget is not enough for any dish.");
}

if (hasReservation) {
    console.log("Reservation confirmed.");
} else {
    console.log("You do not have a reservation.");
} 

// Personalised message
if (isOldEnough && canAfford && hasReservation) {
    console.log(
        `Welcome ${customerName}! Your table is ready. Enjoy your meal!`
    );
} else if (!isOldEnough) {
    console.log(
        `Sorry ${customerName}, you are not eligible to dine because you are under 18.`
    );
} else if (!canAfford) {
    console.log(
        `Sorry ${customerName}, your budget is too low to purchase any dish.`
    );
} else {
    console.log(
        `Hello ${customerName}, please make a reservation before dining with us.`
    );
}