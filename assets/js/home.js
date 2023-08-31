// Getting HTML elements

const searchBar = document.getElementById("search-bar");
const searchList = document.getElementById("search-list");
const searchButton = document.getElementById("search-button");

//iife function

(function() {
    displayList();
})();

// Event Listeners

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    removeList();
    displayList();
});

// Functions

async function getHerosList(searchBy = "") {
    let url;
    if(searchBy == "") url = "https://gateway.marvel.com:443/v1/public/characters?limit=100&ts=1&apikey=045f3b6f0feb72129d011e0c8c2da774&hash=e50120b2312ba2aeb9686d8ccfdcba4d";
    else url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchBy}&limit=100&ts=1&apikey=045f3b6f0feb72129d011e0c8c2da774&hash=e50120b2312ba2aeb9686d8ccfdcba4d`;
    let res = await fetch(url);
    let data = await res.json();
    return data.data.results;
}

async function displayList() {
    const herosList = await getHerosList(searchBar.value);
    for(hero of herosList) {
        let heroItem = document.createElement("li");
        heroItem.setAttribute('class', "hero-item");
        let heroImage = document.createElement("img");
        heroImage.setAttribute('src', hero.thumbnail.path + "." + hero.thumbnail.extension);
        heroImage.setAttribute('class', "hero-item-img");
        let heroName = document.createElement("span");
        heroName.setAttribute('class', "hero-item-name");
        heroName.innerText = hero.name;
        let heroButtonContainer = document.createElement("div");
        heroButtonContainer.setAttribute('class', "hero-item-button-container");
        let heroInfoButton = document.createElement("button");
        heroInfoButton.setAttribute('class', "hero-item-info-button");
        heroInfoButton.innerText = "Learn More"
        let heroFavButton = document.createElement("button");
        heroFavButton.setAttribute('class', "hero-item-fav-button");
        heroFavButton.innerText = "Favroite";
        heroButtonContainer.append(heroInfoButton, heroFavButton);
        heroItem.append(heroImage, heroName, heroButtonContainer);
        searchList.append(heroItem);
    }
}

function removeList() {
    child = searchList.firstElementChild;
    while(child) {
        child.remove();
        child = searchList.firstElementChild;
    }
}