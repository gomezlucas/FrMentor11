class UI {
    constructor() {
        this.countryContainer = document.querySelector(".country-container")
        this.borderContainer = document.querySelector("#border-container")
        this.theme
        this.bodyD = document.querySelector('body')
        this.navbarContainer = document.querySelector('.navbar-container')
        this.backButton = document.querySelector('.back-button')
    }

    showCountry(country) {
        let div = `
    <div class="country-flag">
    <img src="${country.flag}" alt="" srcset="">
</div>
<div class="country-info">
    <h1 class="country-info__name"> ${country.name}</h1>
    <div class="country-lists">
        <ul class="country-info__data1">
            <li>
                <p><strong>Native Name:</strong> ${country.nativeName}</p>
            </li>
            <li>
                <p><strong>Population:</strong> ${country.population}</p>
            </li>
            <li>
                <p><strong>Region:</strong> ${country.region}</p>
            </li>
            <li>
                <p><strong>Sub Region:</strong> ${country.subregion}</p>
            </li>
            <li>
                <p><strong>Capital:</strong> ${country.capital}</p>
            </li>
        </ul>
        <ul class="country-info__data2">
            <li>
                <p><strong>Top Level Domain: </strong> ${country.topLevelDomain}</p>
            </li>
            <li>
                <p><strong>Currency: </strong>${country.currencies[0].name}</p>
            </li>
            <li>
                <p><strong>Languages: </strong> ${this.showLanguages(country.languages)}</p>
            </li>
        </ul>

        
    </div>
    `
        this.countryContainer.innerHTML = div
        if (country.borders.length === 0) {
            document.querySelector('.country-info__borders').innerHTML = ''
        } else {
            this.checkBorders(country.borders)
        }
    }


    showLanguages(languagesArr) {
        let number = 0
        let languages = ''
        languagesArr.forEach(item => {
            if (number < languagesArr.length - 1) {
                languages += item.name + ', '
            } else {
                languages += item.name + ' '
            }
            number++
        })
        return languages
    }


    async fetchBorder(borderCode) {

        const borderUrl = `https://restcountries.eu/rest/v2/alpha/${borderCode}`
        const borderInfo = await fetch(borderUrl)
        const borderJson = await borderInfo.json()
        const border = await borderJson.name

        return border
    }

    showBorders(data) {
        let borderDiv = document.createElement("a")
        if (this.theme === 'dark') {
            borderDiv.classList.add("country-border")
         } else {
            borderDiv.classList.add("country-border-light","country-border")
           }
   
           borderDiv.textContent = data
        this.borderContainer.appendChild(borderDiv)

    }


    checkBorders(bordersCode) {
        bordersCode.forEach(border => {
            this.fetchBorder(border)
                .then(data => {
                    this.showBorders(data)

                })
                .catch(error => console.log(error))
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
        console.log(this.theme)
        return this.theme
    }

    setLightTheme() {
        const navbarButton = document.querySelector(".navbar-button")
        const countryName = document.querySelector('.country-info__name')
        const countryData1 = document.querySelector('.country-info__data1')
        const countryData2 = document.querySelector('.country-info__data2')
        const countryInfoBorders = document.querySelector('.country-info__borders')
        const countryBorders = document.querySelectorAll('.country-border')


        countryName.classList.add('country-info__name-light')
        countryData1.classList.add('country-info__data1-light')
        countryData2.classList.add('country-info__data2-light')
        countryInfoBorders.classList.add('country-info__borders-light')
        countryBorders.forEach(country => {
            console.log(country)
            country.classList.add('country-border-light')

        })
        this.bodyD.classList.add('light-body')
        this.navbarContainer.classList.add('light-navbar-container')
        this.backButton.classList.add('back-button-light')


        navbarButton.classList.add('navbar-button-light')

        this.theme = 'light'
        sessionStorage.setItem('theme', this.theme)
    }

    setDarkTheme() {
        const navbarButton = document.querySelector(".navbar-button")
        const countryName = document.querySelector('.country-info__name')
        const countryData1 = document.querySelector('.country-info__data1')
        const countryData2 = document.querySelector('.country-info__data2')
        const countryInfoBorders = document.querySelector('.country-info__borders')
        const countryBorders = document.querySelectorAll('.country-border')

        countryName.classList.remove('country-info__name-light')
        countryData1.classList.remove('country-info__data1-light')
        countryData2.classList.remove('country-info__data2-light')
        countryInfoBorders.classList.remove('country-info__borders-light')

        countryBorders.forEach(country => {
            country.classList.remove('country-border-light')
        })

        this.bodyD.classList.remove('light-body')
        this.navbarContainer.classList.remove('light-navbar-container')
        this.backButton.classList.remove('back-button-light')
        navbarButton.classList.remove('navbar-button-light')

        this.theme = 'dark'
        sessionStorage.setItem('theme', this.theme)
    }
}

class Country {
    constructor() {
        this.base = "https://restcountries.eu/rest/v2/alpha?codes="
    }

    getCountry() {
        let name = sessionStorage.getItem('country');
        return name
    }

    async fetchCountry(country) {
        const countryUrl = this.base + country
        const countryInfo = await fetch(countryUrl)
        const countryJson = await countryInfo.json()
        return countryJson
    }
}



document.addEventListener('DOMContentLoaded', function () {
    const ui = new UI()
    const country = new Country()
    const backBtn = document.querySelector(".back-button")
    const navbarButton = document.querySelector('.navbar-button')

    backBtn.addEventListener('click', function () {
        document.location.target = "_blank";
        document.location.href = "index.html";
    })

    const namecountry = country.getCountry()
    country.fetchCountry(namecountry)
        .then(data => {
            ui.showCountry(data[0])
            let theme = ui.getTheme()
            if (theme === "dark") {
                ui.setDarkTheme()
            } else {
                ui.setLightTheme()
            }
        })
        .catch(error => console.log(error))


    navbarButton.addEventListener('click', function () {

        let theme = ui.getTheme()
        console.log(theme)
        if (theme === "dark") {
            ui.setLightTheme()
        } else {
            ui.setDarkTheme()
        }

    })


})


