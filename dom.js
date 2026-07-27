console.log('Welcome to Asa Kitchen')

//READING
const dishname = document.querySelector("#dishname");
console.log(dishname.textContent);

const price = document.querySelector("#price");
console.log(price.textContent);

const rating = document.querySelector("#rating");
console.log(rating.textContent);

//CHANGING
dishname.textContent = "Chicken Burger";
price.innerHTML = "<strong> $50 </strong>";
rating.innerHTML = "<em> 4 stars </em>";

//dishname.style.color = "#ff0000";
price.style.fontSize = "1.5rem";
rating.style.backgroundColor = "#00ffff";

function addHighlight (){
    dishname.classList.add("highlight");
} 

function removeHighlight (){
    dishname.classList.remove("highlight");
}

function toggleHighlight (){
    dishname.classList.toggle("highlight");
}

