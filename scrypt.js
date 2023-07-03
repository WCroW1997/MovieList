const API__KEY = 'cd8c616ed6b25eb05fd6fd488ec8ee4e'
const API__URL = `https://api.themoviedb.org/3`
const popular = document.querySelector('.popular')
const searchInput = document.querySelector('.nav__input')
const searchZone = document.querySelector('.search__zone')
const popularZone = document.querySelector('.newest')
const modal = document.querySelector('.modal')

const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    slidesPerView: 5,
    spaceBetween: 20,

    // Navigation arrows

    autoplay: {
        delay: 5000,
        pauseOnMouseEnter: true,
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
});

async function loadPopularMovie() {
    const API__POPULAR__URL = `${API__URL}/movie/popular?api_key=${API__KEY}&language=en-US&page=1`
    const resp = await fetch(API__POPULAR__URL, {
        method: 'GET',
    })

    const respResults = await resp.json()
    console.log(respResults);

    if (resp.ok) {
        getPopularMovie(respResults)
    }
}

function getPopularMovie(data) {
    const popularMovie = data.results
    console.log(popularMovie);
    popular.innerHTML = ''
    popularMovie.forEach(element => {
        const movieTitle = element.title
        const movieRate = element.vote_average
        const moviePoster = element.poster_path
        const movieId = element.id
        const template =
            `
        <div class="card swiper-slide" onclick=showModal(${movieId})>
            <span class='card__label card__label_${getClassByRate(movieRate)}'>${movieRate}</span>
            <img src="https://image.tmdb.org/t/p/w500${moviePoster}" alt="" class="card__img">
            <h3 class="card__title">${movieTitle}</h3>
        </div>
        `

        popular.innerHTML += template
    });
}

async function loadSearchMovie(searchQuery) {
    const API__SEARCH__URL = `${API__URL}/search/movie?api_key=${API__KEY}&language=en-US&page=1&query=${searchQuery}&include_adult=false`
    const resp = await fetch(API__SEARCH__URL, {
        method: 'GET',
    })

    const respResults = await resp.json()

    if (resp.ok) {
        getSearchMovie(respResults)
    }
}

function getSearchMovie(data) {
    const searchMovie = data.results
    console.log(searchMovie);
    searchZone.innerHTML = ''
    searchMovie.forEach(element => {
        const movieTitle = element.title
        const movieRate = (element.vote_average).toFixed(1)
        const moviePoster = element.poster_path
        const movieId = element.id
        const template =
            `
        <div class="card swiper-slide card__search" onclick=showModal(${movieId})>
            <span class='card__label card__label_${getClassByRate(movieRate)}'>${movieRate}</span>
            <img src="https://image.tmdb.org/t/p/w500${moviePoster}" alt="" class="card__img">
            <h3 class="card__title">${movieTitle}</h3>
        </div>
        `

        searchZone.innerHTML += template
    });
}

function getClassByRate(vote) {
    if (vote >= 7.5) {
        return 'green'
    } else if (vote > 5) {
        return 'yellow'
    } else {
        return 'red'
    }
}

searchInput.addEventListener('input', () => {
    searchZone.innerHTML = ''
    if (searchInput.value) {
        popularZone.style.display = 'none'
        loadSearchMovie(searchInput.value)
    } else {
        popularZone.style.display = 'block'
    }

})

loadPopularMovie()

const showModal = index => {
    modal.style.display = 'flex'
    loadDetailsMovie(index)
}

const closeModal = () => {
    modal.style.display = 'none'
}

async function loadDetailsMovie(movieId) {
    const API__DETAILS__URL = `${API__URL}/movie/${movieId}?api_key=${API__KEY}&language=en-US`
    const resp = await fetch(API__DETAILS__URL, {
        method: 'GET',
    })
    const respResults = await resp.json()

    if (resp.ok) {
        createModal(respResults)
    }
}

function createModal(data) {
    console.log(data);
    const originTitle = data.original_title
    const title = data.title
    const overview = data.overview
    const moviePoster = data.poster_path
    const genres = data.genres

    modal.innerHTML = `
    <div class="modal__img">
        <img src="https://image.tmdb.org/t/p/w500${moviePoster}" alt="" class="movie__poster">
    </div>
    <div class="modal__info">
        <h2 class="movie__title">${title}</h2>
        <div class="movie__ganres">
            ${genres.map((genre) => `<span class="movie__ganre">${genre.name}</span>`)}
        </div>
        <p class="movie__originTitle">${originTitle}</p>
        <p class="movie__overview">${overview}</p>
        <button class="btn btn__modal" onclick=closeModal()>Close</button>
    </div>
    `
}