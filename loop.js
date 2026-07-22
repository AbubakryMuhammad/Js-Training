// Create an array of 5 order prices
let orderPrices = [5000, 3000, 7500, 2500, 4000];

// Create a variable to store the total
let total = 0;

// Loop through the array
for (let i = 0; i < orderPrices.length; i++) {
    // Add each price to the total
    total = total + orderPrices[i];

    // Log each price
    console.log("Order price:", orderPrices[i]);
}

// Log the final total
console.log("Final total:", total);

// Calculate 10% service charge
let serviceCharge = total * 0.10;

// Add service charge to the total
let totalWithServiceCharge = total + serviceCharge;

// Log the service charge
console.log("10% Service charge:", serviceCharge);

// Log the final amount
console.log("Total with service charge:", totalWithServiceCharge);