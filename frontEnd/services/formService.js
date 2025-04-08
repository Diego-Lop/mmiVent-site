angular.module('monApp').factory('formService', ['$http', function($http) {
    const API_URL = 'https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api';
  
    return {
      registerUser: function(userData) {
        return $http.post(`${API_URL}/register`, userData).then(res => res.data);
      },
      // éventuellement ajouter d'autres méthodes génériques de formulaires
    };
  }]);
  