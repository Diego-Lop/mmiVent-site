// angular.module('monApp').factory('authInterceptor', ['$q', '$injector', '$window', function($q, $injector, $window) {
//     return {
//       responseError: function(response) {
//         if (response.status === 401) {
//           const authService = $injector.get('authService'); // Injection dynamique
//           authService.logout();
//           $window.location.reload();
//         }
//         return $q.reject(response);
//       }
//     };
//   }]);
  