app.controller('AdminController', ['$scope', '$http', 'authService', function($scope, $http, authService) {
    const token = authService.getToken();
    const headers = {
      'Authorization': 'Bearer ' + token
    };
  
    $scope.evenements = [];
    $scope.utilisateurs = [];
    $scope.eventToEdit = {};
  
    // Récupérer tous les événements
    $http.get('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/admin/evenements/', { headers }).then(function(response) {
      $scope.evenements = response.data.evenements;
    });
  
    // Supprimer un événement
    $scope.supprimerEvenement = function(id) {
      if (confirm('Supprimer cet événement ?')) {
        $http.delete('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/admin/evenement/' + id, { headers }).then(function() {
          $scope.evenements = $scope.evenements.filter(e => e.id !== id);
        });
      }
    };
  
    // Récupérer tous les utilisateurs
    $http.get('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/admin/users', { headers }).then(function(response) {
      $scope.utilisateurs = response.data.utilisateurs;
    });
  
    // Activer/désactiver un utilisateur
    $scope.toggleActivation = function(id) {
      $http.patch('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/admin/user/' + id + '/toggle', {}, { headers }).then(function(response) {
        alert('Utilisateur mis à jour. Statut actif : ' + response.data.isActive);
      });
    };
  
    // Supprimer un utilisateur
    $scope.supprimerUtilisateur = function(id) {
      if (confirm('Supprimer cet utilisateur ?')) {
        $http.delete('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/admin/user/' + id, { headers }).then(function() {
          $scope.utilisateurs = $scope.utilisateurs.filter(u => u.id !== id);
        });
      }
    };
    
    $scope.modifierEvenement = function(id) {
      const event = $scope.evenements.find(e => e.id === id);
      if (event) {
        // Cloner l'événement pour éviter de modifier l'original sans confirmation
        $scope.eventToEdit = angular.copy(event);
        document.getElementById('popupEditEvent').classList.add('active');
        // console.log("event to edit : " , $scope.eventToEdit);
      }
    };
    
    $scope.fermerPopupEdit = function() {
      document.getElementById('popupEditEvent').classList.remove('active');

    };
    
    // Fonction pour envoyer les données modifiées
    $scope.modifierEvenements = function(id) {
      $http.put('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/admin/evenement/' + id, $scope.eventToEdit, { headers })
        .then(function(response) {
          // Mettre à jour la liste après succès
          const index = $scope.evenements.findIndex(e => e.id === id);
          if (index !== -1) {
            $scope.evenements[index] = angular.copy($scope.eventToEdit);
          }
          document.getElementById('popupEditEvent').classList.remove('active');
        })
        .catch(function(error) {
          console.error('Erreur lors de la modification :', error);
        });
    };
    
  
    
  
  }]);
  