
class UI {
    constructor() {
        this.cardsContainer = document.querySelector("#cards-container");
        this.bodyD = document.querySelector('body')
        this.navbarContainer = document.querySelector('.navbar-container')
        this.formRegion = document.querySelector('.header-form__region')
        this.formInput = document.querySelector('.header-form__country')
        this.theme
        this.loading = document.querySelector('.loading')
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


    getTheme() {
        if (sessionStorage.getItem('theme') === 'light') {
            this.theme = 'light'
        } else if (sessionStorage.getItem('theme') === 'dark') {
            this.theme = 'dark'
        } else {
            this.theme = 'dark'
            sessionStorage.setItem('theme', this.theme)
        }
        return this.theme
    }

    setLightTheme() {
        const cards = document.querySelectorAll('.card')
        const magnefier = document.querySelector('.magnefier')
        const angleDown = document.querySelector(".angleDown")
        const navbarButton = document.querySelector(".navbar-button")


        this.bodyD.classList.add('light-body')
        this.navbarContainer.classList.add('light-navbar-container')
        this.formInput.classList.add('header-form__country-light')
        this.formRegion.classList.add('header-form__region-light')
        magnefier.classList.add('magnefier-light')
        angleDown.classList.add('angleDown-light')
        navbarButton.classList.add('navbar-button-light')
        cards.forEach(card => {
            card.classList.add('card-light')
        })
        this.theme = 'light'
        sessionStorage.setItem('theme', this.theme)
    }

    setDarkTheme() {
        console.log('entro a dark')
        const cards = document.querySelectorAll('.card')
        const magnefier = document.querySelector('.magnefier')
        const angleDown = document.querySelector(".angleDown")
        const navbarButton = document.querySelector(".navbar-button")

        this.bodyD.classList.remove('light-body')
        this.navbarContainer.classList.remove('light-navbar-container')
        this.formInput.classList.remove('header-form__country-light')
        this.formRegion.classList.remove('header-form__region-light')
        magnefier.classList.remove('magnefier-light')
        angleDown.classList.remove('angleDown-light')
        navbarButton.classList.remove('navbar-button-light')

        cards.forEach(card => {
            card.classList.remove('card-light')
        })
        this.theme = 'dark'
        sessionStorage.setItem('theme', this.theme)

    }

    hideLoader() {
    document.querySelector(".preloader-container").style.display = "none";
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
    const cardsContainer = document.querySelector("#cards-container")
    const navbarButton = document.querySelector('.navbar-button')

    formRegion.children[0].selected = true;
    let countryWord = '';


    countries.getCountries()
        .then(data => {
            ui.showCountries(data)
            let theme = ui.getTheme()
            if (theme === "dark") {
                ui.setDarkTheme()
            } else {
                ui.setLightTheme()
            }
            ui.hideLoader()
        })
        .catch(error => console.log(error))




    formRegion.addEventListener('click', function (event) {
        event.preventDefault()
        formInput.value = ''
        countries.getRegion(formRegion.value)
            .then(data => {
                cardsContainer.innerHTML = ''
                ui.showCountries(data)
                let theme = ui.getTheme()
                if (theme === "dark") {
                    ui.setDarkTheme()
                } else {
                    ui.setLightTheme()
                }
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
                    let theme = ui.getTheme()
                    if (theme === "dark") {
                        ui.setDarkTheme()
                    } else {
                        ui.setLightTheme()
                    }
                }
            })
            .catch(error => console.log(error))
    })

    navbarButton.addEventListener('click', function () {

        let theme = ui.getTheme()
        console.log(theme)
        if (theme === "dark") {
            ui.setLightTheme()
        } else {
            ui.setDarkTheme()
        }

    })

});


