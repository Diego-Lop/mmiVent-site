angular.module('monApp').controller('MainController', ['$scope', 'authService', function($scope, authService) {
  
  $scope.user = null;
 
  // Fonction utile pour vérifier le rôle
  $scope.hasRole = function(role) {
    return authService.hasRole(role, $scope.user);
  };

  $scope.reponseServeur = null;

  //  ------------------------------- get me --------------------------------
  $scope.getMe = function(){
    authService.getMe()
    .then(function(data) {
    $scope.user = data;
      $scope.reponseServeur = {
        message: 'Connexion réussie !'   
      };
    return $scope.reponseServeur;  
      
    })
  }

  $scope.login = function() {
    authService.login($scope.userform)
      .then(function(data) {
       return $scope.getMe().then(function(data2){
          $scope.reponseServeur = data2;
        })
      })
      .catch(function(error) {
        $scope.reponseServeur = {
          message: "Erreur lors de la connexion",
          erreur: error
        };
      });
  };

  $scope.getMe();
  
  $scope.logout = function() {
    authService.logout();
    $scope.user = null;
    location.reload(); // Recharge la page pour forcer l’état à jour (ou tu peux rebooter dynamiquement si tu veux)
  };
}]);
