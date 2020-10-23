//stores all the elements from our DOM
export const elements = {
  searchForm: document.querySelector('.search'),
  searchRes: document.querySelector('.results'),
  searchInput: document.querySelector('.search__field'),
  searchResList: document.querySelector('.results__list'),
  searchResPages: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
}

export const elementsStrings = {
  loader: 'loader',
}
export const renderLoader = (parent) => {
  const loader = `
 <div class = ${elementsStrings.loader} > 
 <svg> 
 <use href ="img/icons.svg#icon-cw"></use>
 <svg>
 <div> `
  parent.insertAdjacentHTML('afterbegin', loader)
}

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementsStrings.loader}`)
  if (loader) loader.parentElement.removeChild(loader)
}
