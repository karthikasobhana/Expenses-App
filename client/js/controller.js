expenseApp.controller('mainCtrl', function($rootScope, $scope, expenseFactory, $mdDialog, $mdToast) {
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
    // $scope.getDataForCharts();
  });

  $scope.clickme = function(month){
    expenseFactory.testExpense(month,117).then(function(data) {
      $scope.expenses = data.data;
      $scope.currentMonth = monthNames[month];
      // $scope.getDataForCharts();
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

  // google.charts.load('current', {
  //   'packages': ['corechart']
  // });
  // google.charts.setOnLoadCallback(drawChart);

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
      // $scope.getDataForCharts();
      // google.charts.setOnLoadCallback(drawChart);

    });
    $scope.item = '';
    $scope.price = '';
    $scope.note = '';
    $scope.date = '';


  };

  // Delete an expense
  $scope.delete = function(i) {
    expenseFactory.deleteExpense($scope.expenses[i]._id).then(function(data) {
      if (data.data) {
        $scope.expenses.splice(i, 1);
        $scope.simpleToast('Entry Deleted');
        //$scope.getDataForCharts();
        //google.charts.setOnLoadCallback(drawChart);
      }
    });
  };

 $scope.editEntry = function(i){
   var confirm = $mdDialog.prompt()
     .title('Change the entry')
     .textContent('Type your updated item name here')
     .placeholder('Item name')
     .initialValue($scope.expenses[i].item)
     .ok('Okay!')
     .cancel('Cancel');

   $mdDialog.show(confirm).then(function(result, index) {
     $scope.item = result;
     expenseFactory.updateExpense({
       _id: $scope.expenses[i]._id,
       item: $scope.item,
       price: $scope.expenses[i].price,
       note:$scope.expenses[i].note,
       category:$scope.expenses[i].category.id,
       date: $scope.expenses[i].date
     }).then(function(data) {
      $scope.simpleToast('Entry Updated');
      $scope.expenses[i].item = $scope.item;
      $scope.item = '';

     });
   }, function() {
//handle error
   });
 }

 $scope.simpleToast = function(text) {
   $mdToast.show(
     $mdToast.simple()
       .textContent(text)
       .position("top right" )
       .hideDelay(3000)
       .parent(document.getElementById('toast-container'))
   );
 };

 function DialogController($scope, $mdDialog, expense) {
  $scope.expense = expense;
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function() {
    $mdDialog.hide($scope.expense);
  };
}

 $scope.editData = function(i) {
   $mdDialog.show({
     controller: DialogController,
     templateUrl: '../partials/dialog/dialog.tmpl.html',
     parent: angular.element(document.body),
     clickOutsideToClose:true,
     fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
     locals: {
       expense : $scope.expenses[i]
     }
   })
   .then(function(expense) {
     expenseFactory.updateExpense({
       _id: expense._id,
       item:expense.item,
       price: expense.price,
       note:expense.note,
       category:expense.category,
       date: expense.date
     }).then(function(data) {
      $scope.simpleToast('Entry Updated');
      $scope.expenses[i] = expense;
     });
   }, function() {
console.log('Modal was closed')
   });
 };

});
