angular.module('monApp').controller('FormController', ['$scope', 'formService', function($scope, formService) {
    $scope.user = {};
    $scope.reponseServeur = null;
  
    $scope.submitForm = function() {
      formService.registerUser($scope.user)
        .then(function(data) {
          $scope.reponseServeur = {
            success: true,
            message: "Inscription réussie !",
            data: data
          };
        })
        .catch(function(error) {
          $scope.reponseServeur = {
            success: false,
            message: "Erreur lors de l'inscription.",
            error: error
          };
        });
    };
  }]);
  