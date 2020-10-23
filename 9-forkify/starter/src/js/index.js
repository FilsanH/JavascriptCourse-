// Global app controller
// search - object
// current recipie object
// shopping list object
// liked recipies
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'

import Search from './models/search'
import List from './models/list'

import { elements, renderLoader, clearLoader } from './views/base'
import Recipe from './models/recipe'

const state = {}

const controlSearch = async () => {
  //1!) GET query from view

  const query = searchView.getInput()

  if (query) {
    //1 clear previous result    searchView.clearResults()

    //2) New Search object and add  to state
    state.search = new Search(query)

    //3) Prepare UI for results
    searchView.clearInput()
    searchView.clearResults()
    renderLoader(elements.searchRes)

    try {
      //4) Search for recipes

      await state.search.getResults() //updates the this.results

      //5) Render results on UI
      clearLoader()
      console.log(`results are ${state.search.result}`)
      searchView.renderResults(state.search.result)
    } catch (err) {
      alert("Can't get recipes")
    }

    clearLoader()
  }
}

// document.querySelector('.search').addEventListener('sumbit', (e) => {
//   console.log('here')
//   //e.preventDefault()
//   //controlSearch()
// })

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault()
  controlSearch()
})

elements.searchResPages.addEventListener('click', (e) => {
  // put event listener on something that exists at loading then use target
  const btn = e.target.closest('.btn-inline')
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10) //data-go thing returns a string
    searchView.clearResults()

    searchView.renderResults(state.search.result, goToPage)
  }
})

// RECIPE controller
//everytime the url changes do something
const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '')
  console.log(`shorty gotta ${id}`)
  if (id) {
    //Prepare /ui for changes
    recipeView.clearRecipe()
    renderLoader(elements.recipe)

    // //Highlight selected search item
    // if (state.search) {
    //   searchView.highlightSelected(id)
    // }

    //Create new recipe object
    state.recipe = new Recipe(parseInt(id)) //returns a promise as

    try {
      //Get recipe data and parse ingredients
      await state.recipe.getRecipe()
      console.log(state.recipe.ingredients)
      state.recipe.parseIngredients()

      //Testing

      //Calculate servings and time
      state.recipe.calcTime()
      state.recipe.calServings()

      //Render recipe
      clearLoader()
      recipeView.renderRecipe(state.recipe)
    } catch (err) {
      alert(err)
    }
  }
}

;['hashchange', 'load'].forEach((event) =>
  window.addEventListener(event, controlRecipe)
)

/**
 * LIST CONTROLLER
 */
const controlList = () => {
  // Create a new list IF there in none yet
  if (!state.list) state.list = new List()

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient)
    listView.renderItem(item)
  })
}

// Handling recipe button clicks
elements.recipe.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec')
      recipeView.updateServingsIngredients(state.recipe)
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc')
    recipeView.updateServingsIngredients(state.recipe)
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList()
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike()
  }
})

// Handle delete and update list item events
elements.shopping.addEventListener('click', (e) => {
  const id = e.target.closest('.shopping__item').dataset.itemid

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id)

    // Delete from UI
    listView.deleteItem(id)

    // Handle the count update
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10)
    state.list.updateCount(id, val)
  }
})
