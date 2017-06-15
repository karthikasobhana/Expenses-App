expenseApp.controller('mainCtrl', function($rootScope, $scope, expenseFactory, $mdDialog) {
  $scope.expenses = [];
  $scope.isEditable = [];
  $scope.editable = false;
  var date = new Date().getTime();
  var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
  $scope.currentMonth = 'June';
  $scope.categoryOptions = [{
      id: '1',
      name: 'Food'
    },
    {
      id: '2',
      name: 'Bills'
    },
    {
      id: '3',
      name: 'Supermarket'
    },{
      id: '4',
      name: 'Flat Expenses'
    }
  ]
  // get all expenses on Load
  expenseFactory.getExpense().then(function(data) {
    $scope.expenses = data.data;
    $scope.getDataForCharts();
  });

  $scope.clickme = function(month){
    expenseFactory.testExpense(month,117).then(function(data) {
      $scope.expenses = data.data;
      $scope.getDataForCharts();
    });
  }

  $scope.getDataForCharts = function() {
    $scope.pieData = {
      "Bills": 0,
      "Supermarket": 0,
      "Food": 0
    }
    $scope.expenses.forEach(function(item) {
      $scope.pieData[item.category.name] = parseInt($scope.pieData[item.category.name]) + parseInt(item.price);
    })
  }

  google.charts.load('current', {
    'packages': ['corechart']
  });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {

    var data = google.visualization.arrayToDataTable([
      ['Category', 'Hours per Day'],
      ['Bills', $scope.pieData.Bills],
      ['Supermarket', $scope.pieData.Supermarket],
      ['Food', $scope.pieData.Food]
    ]);

    var options = {
      title: 'June 2017'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
  }


  // Save an expense to the server
  $scope.save = function() {
    //Check with condition if necessary values are available or not
    if ($scope.date) {
      date = $scope.date.getTime();
    }
    expenseFactory.saveExpense({
      "item": $scope.item,
      "price": $scope.price,
      "note": $scope.note,
      "category": $scope.categoryOptions[$scope.category - 1],
      "date": date
    }).then(function(data) {
      $scope.expenses.push(data.data);
      $scope.getDataForCharts();
      google.charts.setOnLoadCallback(drawChart);

    });
    $scope.item = '';
    $scope.price = '';
    $scope.note = '';
    $scope.date = '';


  };
  //update the status of the expense
  $scope.updateStatus = function($event, _id, i) {
    var cbk = $event.target.checked;
    var _t = $scope.expenses[i];
    expenseFactory.updateExpense({
      _id: _id,
      item: $scope.item,
      price: $scope.price,
      note:$scope.note,
      category:$scope.categoryOptions[$scope.category-1],
      date: date
    }).then(function(data) {
      $scope.item = '';
      $scope.price = '';
      $scope.note = '';
      $scope.date = '';
    });
  };
  // Update the edited expense
  $scope.edit = function($event, i) {
    if ($event.which == 13 && $event.target.value.trim()) {
      var _t = $scope.expenses[i];
      expenseFactory.updateExpense({
        _id: _t._id,
        isCompleted: _t.isCompleted
      }).then(function(data) {
        if (data.data.updatedExisting) {
          $scope.isEditable[i] = false;
        } else {
          alert('Oops something went wrong!');
        }
      });
    }
  };
  // Delete an expense
  $scope.delete = function(i) {
    expenseFactory.deleteExpense($scope.expenses[i]._id).then(function(data) {
      if (data.data) {
        $scope.expenses.splice(i, 1);
        $scope.getDataForCharts();
        google.charts.setOnLoadCallback(drawChart);
      }
    });
  };

  $scope.editEntry = function(i) {
    $scope.editable = true;
    $scope.item = $scope.expenses[i].item;
    $scope.price = $scope.expenses[i].price;
    $scope.note = $scope.expenses[i].note;
    // $scope.date = $scope.tod os[i].date;
  }
  $scope.cancel1 = function() {
    $scope.editable = false;
  }

  $scope.showPrompt = function(ev) {
   // Appending dialog to document.body to cover sidenav in docs app
   var confirm = $mdDialog.prompt()
     .title('What would you name your dog?')
     .textContent('Bowser is a common name.')
     .placeholder('Dog name')
     .ariaLabel('Dog name')
     .initialValue('Buddy')
     .targetEvent(ev)
     .ok('Okay!')
     .cancel('I\'m a cat person');

   $mdDialog.show(confirm).then(function(result) {
     $scope.status = 'You decided to name your dog ' + result + '.';
   }, function() {
     $scope.status = 'You didn\'t name your dog.';
   });
 };

});
