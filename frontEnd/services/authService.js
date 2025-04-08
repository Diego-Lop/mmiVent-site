angular.module('monApp').factory('authService', ['$http','$window', function($http,$window) {
  const API_URL = 'https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api'; // adapte avec le vrai nom de domaine


  let token = localStorage.getItem('token') || null;
  if (token) {
    $http.defaults.headers.common.Authorization = 'Bearer ' +  token;
  }
  return {
    // Connexion via /api/login
    login: function(credentials) {
      return $http.post(`${API_URL}/login_check`, credentials)
        .then(function(response) {
            console.log("Login response:", response.data);
          const token = response.data.token;
          localStorage.setItem('token', token);
          $http.defaults.headers.common.Authorization = 'Bearer ' +  token;
          return response.data;
        });
    },
      
    // Inscription via /api/register
    register: function(credentials) {
      return $http.post(`${API_URL}/register`, credentials).then(function(response) {
        return response.data;
      });
    },

    logout: function() {
      token = null;
      localStorage.removeItem('token');
      $http.defaults.headers.common.Authorization = "";
      $window.location.href = 'index.html';

    },

    isAuthenticated: function() {
      return !!token;
    },

    getToken: function() {
      return token;
    },

    getUser: function() {
      return user;
    },

    getMe: function() {
      return $http.get(`${API_URL}/user/me`)
        .then(function(response) {
          return response.data;
        });
    },
    hasRole: function(role, user) {
      // console.log(user)
      return user && user.roles && user.roles.includes(role);
    }
  };
}]);
