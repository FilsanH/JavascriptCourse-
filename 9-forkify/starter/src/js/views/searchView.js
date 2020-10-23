//Interact with the UI
import { elements } from './base'
export const getInput = () => elements.searchInput.value

export const clearInput = () => {
  elements.searchInput.value = ''
} // are not returning evrything so must be in brackets

export const clearResults = () => {
  elements.searchResList.innerHTML = '' //clears results from view but still in state
  elements.searchResPages.innerHTML = ''
}

export const highlightSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'))
  resultsArr.forEach((el) => {
    el.classList.remove('results__link--active')
  })
  document
    .querySelector(`.results__link[href*="${id}"]`)
    .classList.add('results__link--active')
}


const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = []
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur)
      }
      return acc + cur.length
    }, 0)
    return `${newTitle.join(' ')}...`
  }
  return title
}

export const renderRecipe = (recipe) => {
  //takes single recie
  const markup = `
 <li>
                            <a class="likes__link" href="#${recipe.recipe_id}">
                                <figure class="likes__fig">
                                    <img src="${recipe.image_url}" alt="${
    recipe.title
  }">
                                </figure>
                                <div class="likes__data">
                                    <h4 class="likes__name">${limitRecipeTitle(
                                      recipe.title
                                    )}</h4>
                                    <p class="likes__author">${
                                      recipe.publisher
                                    }</p>
                                </div>
                            </a>
                        </li>
 `

  elements.searchResList.insertAdjacentHTML('beforeend', markup)
}

const creatButton = (page, type) => `  
                <button class="btn-inline results__btn--${type}" data-goto= ${
  type == 'prev' ? page - 1 : page + 1
}>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>
                <span> Page ${type == 'prev' ? page - 1 : page + 1}</span>
                 </button>`

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage)
  let button
  if (page === 1 && pages > 1) {
    // Only button to go to next page
    button = creatButton(page, 'next')
  } else if (page < pages) {
    // both buttons
    button = `
             ${creatButton(page, 'prev')}

         ${creatButton(page, 'next')}
`
  } else if (page === pages && pages > 1) {
    // Only button to go to prev page
    button = creatButton(page, 'prev')
  }
  elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  // render results of current page
  const start = (page - 1) * resPerPage
  const end = page * resPerPage // not including
  // render pagination buttons
  recipes.slice(start, end).forEach(renderRecipe) // returns single recipie object as property of recipies
  renderButtons(page, recipes.length, resPerPage)
}
