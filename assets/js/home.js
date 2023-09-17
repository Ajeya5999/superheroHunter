// Getting / Declaring HTML elements

let searchBar = document.getElementById("search-bar");
let searchList = document.getElementById("search-list");
let searchButton = document.getElementById("search-button");
const pageHeader = document.getElementById("page-header");
const content = document.getElementById("content");
const viewFavButton = document.getElementById("view-favroites");

//iife function

(function() {
    searchBar.value = "";
    displayList();
})();

// Event Listeners

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    removeList();
    displayList();
});

pageHeader.addEventListener('click', showHome);

viewFavButton.addEventListener('click', viewFavroites);

// Functions

async function getHerosList(searchBy) {
    let url;
    if(searchBy == "") url = "https://gateway.marvel.com:443/v1/public/characters?limit=100&ts=1&apikey=045f3b6f0feb72129d011e0c8c2da774&hash=e50120b2312ba2aeb9686d8ccfdcba4d";
    else url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchBy}&limit=100&ts=1&apikey=045f3b6f0feb72129d011e0c8c2da774&hash=e50120b2312ba2aeb9686d8ccfdcba4d`;
    let res = await fetch(url);
    let data = await res.json();
    return data.data.results;
}

// Home Page

async function displayList() {
    const herosList = await getHerosList(searchBar.value.trim());
    for(hero of herosList) {
        let heroItem = document.createElement("li");
        heroItem.heroId = hero.id;
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
        heroInfoButton.addEventListener('click', showHeroInfo);
        let heroFavButton = document.createElement("button");
        heroFavButton.setAttribute('class', "hero-item-fav-button");
        heroFavButton.innerText = "Favroite";
        heroFavButton.addEventListener('click', addFromHomeToFavList)
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

function showHome() {
    removeContent();
    let form = document.createElement("form");
    form.setAttribute("id", "search");
    searchBar.value = "";
    form.append(searchBar, searchButton);
    let searchListContainer = document.createElement("div");
    searchListContainer.setAttribute("id", "search-list-container");
    searchList = document.createElement("ul");
    searchList.setAttribute("id", "search-list");
    searchListContainer.append(searchList);
    content.append(form, searchListContainer);
    displayList();
}

function removeContent() {
    child = content.firstElementChild;
    while(child) {
        child.remove();
        child = content.firstElementChild;
    }
}

function addFromHomeToFavList() {
    localStorage.setItem(this.parentNode.parentNode.heroId, this.parentNode.parentNode.childNodes[1].innerText);
    alert("added to Favroites");
}

// SuperHero Page

async function showHeroInfo() {
    let heroId = this.parentNode.parentNode.heroId;
    removeContent();
    let res = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${heroId}?ts=1&apikey=045f3b6f0feb72129d011e0c8c2da774&hash=e50120b2312ba2aeb9686d8ccfdcba4d`);
    let heroData = await res.json();
    let hero = heroData.data.results;
    hero = hero[0];
    let heroContainer = document.createElement("div");
    heroContainer.setAttribute("id", "hero-container");
    heroContainer.heroId = heroId;
    let heroNameContainer = document.createElement('h1');
    heroNameContainer.setAttribute('id', 'hero-name-container');
    heroNameContainer.innerText = hero.name;
    let heroImgContainer = document.createElement("div");
    heroImgContainer.setAttribute("id", "hero-img-container");
    let heroImg = document.createElement("img");
    heroImg.setAttribute('src', hero.thumbnail.path + "." + hero.thumbnail.extension);
    heroImg.setAttribute('alt', 'hero image');
    heroImg.setAttribute('id', 'hero-img');
    heroImgContainer.append(heroImg);
    let heroDcrptContainer = document.createElement("div");
    heroDcrptContainer.setAttribute('id', 'hero-dcrpt-container');
    let heroIntroContainer = document.createElement("div");
    heroIntroContainer.setAttribute("id", 'hero-intro-container');
    if(hero.description === "") heroIntroContainer.innerText = "No Description Found";
    else heroIntroContainer.innerText = hero.description;
    let heroEventsContainer = document.createElement("div");
    heroEventsContainer.setAttribute("id", "hero-events-container");
    let heroComics = document.createElement("div");
    let heroComicsHeader = document.createElement("h4");
    heroComicsHeader.innerText = "Comics";
    let heroComicsList = document.createElement("ul");
    fillHeroEvents(hero.comics.items, heroComicsList);
    heroComics.append(heroComicsHeader, heroComicsList);
    let heroSeries = document.createElement("div");
    let heroSeriesHeader = document.createElement("h4");
    heroSeriesHeader.innerText = "Series";
    let heroSeriesList = document.createElement("ul");
    fillHeroEvents(hero.series.items, heroSeriesList);
    heroSeries.append(heroSeriesHeader, heroSeriesList);
    heroEventsContainer.append(heroComics, heroSeries);
    heroDcrptContainer.append(heroIntroContainer, heroEventsContainer);
    let heroFavButton = document.createElement("button");
    heroFavButton.setAttribute('class', "hero-item-fav-button");
    heroFavButton.setAttribute('id', "learn-more-fav-button");
    heroFavButton.innerText = "Favroite";
    heroFavButton.addEventListener('click', addFromInfoToFavList);
    heroContainer.append(heroNameContainer, heroImgContainer, heroDcrptContainer, heroFavButton);
    content.append(heroContainer);
}

function fillHeroEvents(heroEvents, heroEventContainer) {
    for(let iterator = 0; iterator < 5 && iterator < heroEvents.length; iterator++) {
        let event = document.createElement("li");
        event.innerText = heroEvents[iterator].name;
        heroEventContainer.append(event);
    }
}

function addFromInfoToFavList() {
    localStorage.setItem(this.parentNode.heroId, this.parentNode.childNodes[0].innerText);
    alert("added to Favroites");
}

// Favroites page

async function viewFavroites() {
    removeContent();
    if(localStorage.length === 0) {
        let message = document.createElement("h1");
        message.setAttribute("id", "message");
        message.innerText = "You have no favroites";
        content.append(message);
    }
    else {
        let favList = document.createElement("ul");
        favList.setAttribute('id', 'fav-list');
        for(let iterator = 0; iterator < localStorage.length; iterator++) {
            let res = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${localStorage.key(iterator)}?ts=1&apikey=045f3b6f0feb72129d011e0c8c2da774&hash=e50120b2312ba2aeb9686d8ccfdcba4d`);
            let heroData = await res.json();
            let hero = heroData.data.results;
            hero = hero[0];
            let heroItem = document.createElement("li");
            heroItem.setAttribute('class', "hero-item");
            heroItem.heroId = hero.id;
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
            heroInfoButton.addEventListener('click', showHeroInfo);
            let removeFavButton = document.createElement("button");
            removeFavButton.setAttribute('class', "remove-fav-hero-button");
            removeFavButton.innerText = "Remove";
            removeFavButton.addEventListener('click', removeFromFav)
            heroButtonContainer.append(heroInfoButton, removeFavButton);
            heroItem.append(heroImage, heroName, heroButtonContainer);
            favList.append(heroItem);
        }
        content.append(favList);
    }
}

function removeFromFav() {
    localStorage.removeItem(this.parentNode.parentNode.heroId);
    this.parentNode.parentNode.remove();
}