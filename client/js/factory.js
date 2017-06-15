expenseApp.factory('expenseFactory', function($http) {
  var urlBase = '/expenses';
  var expenseService = {};

  expenseService.getExpense = function() {
    var date = new Date();
    var month = date.getMonth();
    var year = date.getYear();
    return $http.get(urlBase+'/'+month+'/'+year);
  };
  expenseService.testExpense = function(month, year) {
    return $http.get(urlBase+'/'+month+'/'+year);
  };

  expenseService.saveExpense = function(expense) {
    return $http.post(urlBase, expense);
  };
  expenseService.updateExpense = function(expense) {
    return $http.put(urlBase, expense);
  };
  expenseService.deleteExpense = function(id) {
    return $http.delete(urlBase + '/' + id);
  };
  return expenseService;
});
