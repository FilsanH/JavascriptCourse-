// this is a iife var cant be accessed outside the scope private and public modules  this is an immediately invoked variable
var budgetcontroller = (function () {
  var Expense = function (id, description, value) {
    this.id = id
    this.description = description
    this.value = value
    this.percentage = -1
  }

  //add method as prototype  Notice have two different prototypes for the two functions cal and set percentaeg
  Expense.prototype.calculatePercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100)
    } else {
      this.percentage = -1
    }
    console.log(this.percentage)
  }

  Expense.prototype.getPercentage = function () {
    return this.percentage
  }

  var Income = function (id, description, value) {
    this.id = id
    this.description = description
    this.value = value
  }

  var data = {
    allItems: {
      //hold income or expense odj
      exp: [],
      inc: [],
    },

    totals: {
      exp: 0,
      inc: 0,
    },

    budget: 0,
    percentage: -1, //nonexistent
  }

  var calculateTotal = function (type) {
    var sum = 0
    data.allItems[type].forEach(function (item) {
      sum = sum + item.value
    })

    data.totals[type] = sum
  }

  return {
    addItem: function (type, des, val) {
      var newItem

      //create a new ID
      if (data.allItems[type.length] > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1
      } else {
        ID = 0
      }

      if (type === 'exp') {
        newItem = new Expense(ID, des, val)
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val)
      }

      data.allItems[type].push(newItem)
      return newItem
    },

    deleteItem: function (type, id) {
      var ids = data.allItems[type].map(function (item) {
        //map returns an array of IDs that currently exist
        return item.id
      })
      index = ids.indexOf(id) // find index of particular array

      if (index !== -1) {
        data.allItems[type].splice(index, 1) // removes the obj
      }
    },

    calculateBudget: function () {
      //1. calculate total income and expenses
      calculateTotal('exp')
      calculateTotal('inc')
      //2. Calulate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp
      //3. Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
      } else {
        data.percentage = -1 //undefined / falsy
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(function (item) {
        item.calculatePercentage(data.totals.inc)
      })
    },

    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function (item) {
        return item.getPercentage()
      })
      return allPerc
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      }
    },

    testing: function () {
      console.log(data)
    },
  }
})()

//UI controller
var UIcontroller = (function () {
  ///create a private object that stores all strings realting to the objest classes
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month',
  }

  var nodeListForEach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i)
    }
  }
  var formatNumber = function (num, type) {
    //+ or - before inc amnd exp
    // work with abs numbers

    num = Math.abs(num)
    num = num.toFixed(2) //dp

    numSplit = num.split('.')

    int = numSplit[0]
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3)
      //input 12443 output 12,443
    }

    dec = numSplit[1]

    //ternary opperator
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec
  }
  return {
    //aim is to have functions that only set or retreive data

    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //either inc or expense
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      }
    },

    addListItem: function (obj, type) {
      //create HTML string with plaeholder text

      var html, newHtml, element

      if (type === 'inc') {
        element = DOMstrings.incomeContainer
        html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer

        html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
      }

      //Replace the placeholder text with some actual data

      newHtml = html.replace('%id%', obj.id)

      newHtml = newHtml.replace('%description%', obj.description)
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type))

      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)
    },

    getDOMStrings: function () {
      return DOMstrings //this is a function therefore it must be called
    },

    clearFields: function () {
      console.log('herer')
      var fields, fieldsArr

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
      )

      fieldsArr = Array.prototype.slice.call(fields) //chnage array like object to array

      fieldsArr.forEach(function (current, index, array) {
        current.value = '' //doc.query.element.value = "" so deleting the contents
      })

      fieldsArr[0].focus() //puts the cursor on the description box once its done

      //fieldsArr = Array.prototype.slice.call(fields);
    },

    displayBudget: function (obj) {
      var type
      obj.budget > 0 ? (type = 'inc') : (type = 'exp')
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      )
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        'inc'
      )
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, 'exp')
      document.querySelector(DOMstrings.percentageLabel).textContent =
        obj.percentage

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + '%'
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '----'
      }
    },

    deleteListItem: function (selectorID) {
      //move up in the DOM then remove the child
      var el = document.getElementById(selectorID)
      el.parentNode.removeChild(el)
    },

    displayPercentages: function (percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel) //returns a nodelist

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%'
        } else {
          current.textContent = '---'
        }
      })
    },
    displayMonth: function () {
      var now, year, month, day
      now = new Date()

      year = now.getFullYear()
      month = now.getMonth()
      day = now.getDay()

      document.querySelector(DOMstrings.dateLabel).textContent =
        day + ' / ' + month + ' / ' + year
    },

    changedType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ',' +
          DOMstrings.inputDescription +
          ',' +
          DOMstrings.inputValue
      )

      nodeListForEach(fields, function (item) {
        item.classList.toggle('red-focus')
      })

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red')
    },
  }
})()

//Global APP Controller
var controller = (function (budgetCtrl, UIctrl) {
  var setupEvnentListners = function () {
    var DOMstrings = UIctrl.getDOMStrings()

    document
      .querySelector(DOMstrings.inputBtn)
      .addEventListener('click', ctrlAddItem)

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem()
      }
    })

    document
      .querySelector(DOMstrings.container)
      .addEventListener('click', ctrlDeleteItem)

    document
      .querySelector(DOMstrings.inputType)
      .addEventListener('change', UIctrl.changedType)
  }

  var updateBudget = function () {
    //1. Calculate the budget
    budgetCtrl.calculateBudget()
    // 2. Return the budget
    var budget = budgetCtrl.getBudget()
    //3. Display the budget on the

    UIctrl.displayBudget(budget)
  }

  var updatePercentage = function () {
    // 1. Caluate percentages
    budgetCtrl.calculatePercentages()

    // 2.  Read percentage from the budget controller
    var percentages = budgetCtrl.getPercentages()

    // 3. Update the UI with the new percentages
    UIctrl.displayPercentages(percentages)
  }

  var ctrlAddItem = function () {
    //declare variables at the top first
    var input, newItem, addItem
    //1. GEt the filled input data
    input = UIctrl.getInput()
    console.log(input)

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      //2. Add the item to the budget Controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value)

      //3. Add the item to the UI

      addItem = UIctrl.addListItem(newItem, input.type)
      // Calculate the budget
      UIctrl.clearFields()

      //5. display budget

      updateBudget()

      //6. Calculate and update percentages
      updatePercentage()
    }
  }

  var ctrlDeleteItem = function (event) {
    //we want the parent node and move up from what we click on and keep moving up
    var itemID, splitID, type, ID

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id

    if (itemID) {
      //inc-1
      splitID = itemID.split('-')
      type = splitID[0]
      ID = parseInt(splitID[1])

      //1. delete the item from the data structure

      budgetCtrl.deleteItem(type, ID)
      //2. Delete the item from the UI so create a function in uictrl that deletes item given id and type
      UIctrl.deleteListItem(itemID)

      //3. Update and show the new Budget

      updateBudget()

      //6. Calculate and update percentages
      updatePercentage()
    }
  }
  return {
    init: function () {
      console.log('Application has started')
      UIctrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      })
      UIctrl.displayMonth()

      setupEvnentListners()
    },
  }
})(budgetcontroller, UIcontroller)

controller.init()
// remember this is an immediately inovked function expression it has no name so called imediately  ()(input 1, input2) now inputs are available to use inside the function in the bracket
// to access returned iife's return and object
