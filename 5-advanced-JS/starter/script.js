var finalAnswer
var Question = function (text, listAnswers, answer) {
  this.question = text
  this.answers = listAnswers
  this.correctAnswer = answer
  this.ask = function () {
    console.log('Please answer:' + this.question)
    console.log('Select from:')
    this.answers.forEach(function (item, index) {
      console.log(index + ' : ' + item)
    })
    finalAnswer = prompt('What is your answer?')
    if (finalAnswer == this.correctAnswer) {
      console.log('correct')
    } else {
      console.log('incorrect')
    }
  }
}

var questionOne = new Question('How are you', ['good', 'bad', 'fine'], 1)

var questionTwo = new Question('Time?', ['two', 'one', 'three'], 1)

var questionThree = new Question('Weather?', ['sunny', 'cold', 'rainy'], 2)

allQuestions = [questionOne, questionTwo, questionThree]

var select = allQuestions[Math.floor(Math.random() * 3)]

console.log(select.ask()) //function has no return therefor undefined

