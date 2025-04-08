angular.module('monApp').controller('AddEventController', ['$scope', '$http', 'authService', function($scope, $http, authService) {

    $scope.newEvent = {};
  
    function formatDate(dateInput) {
      const d = new Date(dateInput);
      const yyyy = d.getFullYear();
      const mm = ('0' + (d.getMonth() + 1)).slice(-2);
      const dd = ('0' + d.getDate()).slice(-2);
      const hh = ('0' + d.getHours()).slice(-2);
      const min = ('0' + d.getMinutes()).slice(-2);
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:00`;
    }
  
    $scope.ajouterEvenement = function() {
      const formData = new FormData();
      formData.append('nom', $scope.newEvent.nom);
      formData.append('description', $scope.newEvent.description);
      if(!$scope.newEvent.nombreDePlaces){
        $scope.newEvent.nombreDePlaces = 9999;
        formData.append('nombreDePlaces', $scope.newEvent.nombreDePlaces);
      }
      else
        formData.append('nombreDePlaces', $scope.newEvent.nombreDePlaces);

      formData.append('date', formatDate($scope.newEvent.date));
      formData.append('lieux', $scope.newEvent.lieux);
      formData.append('photo', $scope.newEvent.photo);
      if(!$scope.newEvent.prix){
        $scope.newEvent.prix = 0;
        formData.append('prix', $scope.newEvent.prix);
      }
      else
        formData.append('prix', $scope.newEvent.prix);

      formData.append('nomOrganisme', $scope.newEvent.nomOrganisme);
      formData.append('categories', $scope.newEvent.categories);
  
      const token = authService.getToken();
  
  console.log($scope.newEvent.photo)
      if (!token) {
        alert('Vous devez être connecté pour ajouter un événement.');
        return;
      }
  
      $http.post('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/create', formData, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined,
          'Authorization': 'Bearer ' + token
        }
      }).then(function(response) {
        alert('Événement ajouté avec succès !');
        $scope.newEvent = {};
      }, function(error) {
        console.error('Erreur lors de l\'ajout de l\'événement :', error);
        alert('Erreur : ' + (error.data.message || 'Erreur inconnue'));
      });
    };
  }]);
  