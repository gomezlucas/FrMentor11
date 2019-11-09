
class UI {
    constructor() {
        this.cardsContainer = document.querySelector("#cards-container");
    }
 
    showCountries(data) {
        data.forEach(country => {
            let div = ` 
        <div class="card">
        <a   href="#" >
           <div class="card-image" data-id="${country.alpha3Code}">
                <img src=${country.flag} alt="">
            </div>
        </a> 

        <div class="card-info">
        <h2 class="card-name"> ${country.name}</h2>
            <p><strong>Population:</strong> ${country.population}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Capital:</strong> ${country.capital}</p>
        </div>
       
        </div>
        `;
            this.cardsContainer.innerHTML += div;
        })

        let cards = document.querySelectorAll('.card-image')

        cards.forEach(item => {
            item.addEventListener('click', function (event) {
                event.preventDefault()
                console.log(event.target.parentElement.dataset.id)
                let cardSelected = event.target.parentElement.dataset.id
                sessionStorage.setItem('country', cardSelected);
                document.location.target = "_blank";
                document.location.href = "country.html";

            })
        })
    }


    getTheme(){
       let theme
        if (sessionStorage.getItem('theme') === null){
         sessionStorage.setItem('theme', 'dark' )
         theme = 'dark'
         }else{ 
          theme =  sessionStorage.getItem('theme')
       }
        return theme
    }
      

    setTheme(){
        
    }

}


class CountriesApi {
    constructor(region) {
        this.base = "https://restcountries.eu/rest/v2/";
    }

    async getCountries() {
        const countriesInfo = await fetch(this.base)
        const countriesJson = await countriesInfo.json()
        return countriesJson;
    }

    async getRegion(region) {
        const regionUrl = `${this.base}region/${region}`
        const regionInfo = await fetch(regionUrl)
        const regionJson = await regionInfo.json()
        return regionJson
    }

    async getCountryName(word) {
        const countryNameUrl = `${this.base}name/${word}`
        const countryNameInfo = await fetch(countryNameUrl)
        const countryNameJson = await countryNameInfo.json()
        return countryNameJson
    }

}


document.addEventListener("DOMContentLoaded", function (event) {
    const countries = new CountriesApi();
    const ui = new UI();
    const formRegion = document.querySelector('.header-form__region')
    const formInput = document.querySelector('.header-form__country')
    const cardsContainer = document.querySelector("#cards-container");
    formRegion.children[0].selected = true;
    let countryWord = ''
    
        
    //Themes
    let theme = ui.getTheme()
    const bodyD = document.querySelector('body')
    const navbarContainer  = document.querySelector('.navbar-container')
    const navbarButton = document.querySelector(".navbar-button")
    const formRegion = document.querySelector('.header-form__region')
    const formInput = document.querySelector('.header-form__country')
  
    countries.getCountries()
        .then(data => {
            ui.showCountries(data)
        })
        .catch(error => console.log(error))


    formRegion.addEventListener('click', function (event) {
        event.preventDefault()
        formInput.value = ''
        countries.getRegion(formRegion.value)
            .then(data => {
                cardsContainer.innerHTML = ''
                ui.showCountries(data)
            })
            .catch(error => console.log(error))
    })

    formInput.addEventListener('keyup', function (event) {
        event.preventDefault()
        countryWord = event.target.value
        formRegion.children[0].selected = true;
        countries.getCountryName(countryWord)
            .then(data => {
                if (countryWord === '') {
                    ui.getCountries()
                } else {
                    cardsContainer.innerHTML = ''
                    ui.showCountries(data)
                }
            })
            .catch(error => console.log(error))
    })

    navbarButton.addEventListener('click', function(){
        const  cards = document.querySelectorAll('.card')
        const magnefier = document.querySelector('.magnefier')
        const angleDown = document.querySelector(".angleDown")
 
      if(theme === 'dark' ){ 
        bodyD.classList.add('light-body')
        navbarContainer.classList.add('light-navbar-container')
        navbarButton.classList.add('navbar-button-light')
        formInput.classList.add('header-form__country-light')
        formRegion.classList.add('header-form__region-light')
        magnefier.classList.add('magnefier-light')
        angleDown.classList.add('angleDown-light')

        cards.forEach(card => {
            card.classList.add('card-light')
        })
        
        theme = 'light'
    }else if (theme === 'light') {
        bodyD.classList.remove('light-body')
        navbarContainer.classList.remove('light-navbar-container')
        navbarButton.classList.remove('navbar-button-light')
        formInput.classList.remove('header-form__country-light')
        formRegion.classList.remove('header-form__region-light')
        magnefier.classList.remove('magnefier-light')
        angleDown.classList.remove('angleDown-light')

        cards.forEach(card => {
            card.classList.remove('card-light')
        })
        theme = 'dark'
    }
    
    })

});


