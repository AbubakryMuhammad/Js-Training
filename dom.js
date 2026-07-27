console.log('Welcome to Cre8tif Lens')

//READING
const shootName = document.querySelector("#shootname");
console.log(shootName.textContent);

const price = document.querySelector("#price");
console.log(price.textContent);

const hour = document.querySelector("#hours");
console.log(hour.textContent);

//CHANGING
shootName.textContent = "Traditional Wedding";
price.innerHTML = "<strong> $150 </strong>";
hour.innerHTML = "<em> 5 hours </em>";

//shootname.style.color = "#ff0000";
price.style.fontSize = "1.5rem";
hour.style.backgroundColor = "#00ffff";

function addHighlight (){
    shootName.classList.add("highlight");
} 

function removeHighlight (){
    shootName.classList.remove("highlight");
}

function toggleHighlight (){
    shootName.classList.toggle("highlight");
}

