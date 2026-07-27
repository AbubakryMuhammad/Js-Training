console.log('Welcome to Cre8tif Lens')

//READING
const shootName = document.querySelector("#shoot-name");
console.log(shootName.textContent);

const price = document.querySelector("#price");
console.log(price.textContent);

const hour = document.querySelector("#hours");
console.log(hour.textContent);

//CHANGING
shootName.textContent = "Traditional Wedding";
price.innerHTML = "<strong> $150 </strong>";
hour.innerHTML = "<em> 5 hours </em>";
