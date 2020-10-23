import axios from 'axios' //allows you to use fetch call in all browsers I think and automatically returns a jason file

export default class Search {
  constructor(query) {
    //like init then method prototypes are defined later
    this.query = query
  }
  async getResults() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
      ) //removed the this
      this.result = res.data.recipes
      console.log(`here are the recipies ${this.result}`)
    } catch (error) {
      alert(error)
    }
  }
}
