app.controller('DashboardController',['$scope', '$http', 'authService', function($scope, $http, authService) {
  
    const token = authService.getToken();
    const headers = {
      'Authorization': 'Bearer ' + token
    };
    
    $scope.evenements = [];
    $scope.eventToEdit = {};
    $scope.inscriptions = []; 
    $scope.evenementsInscrits = [];
    const currentUserId = authService.getUserId ? authService.getUserId() : 1;

  
   


// Récupérer les événements
  $http.get('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/evenements', { headers })
    .then(function(response) {
      $scope.evenements = response.data;

      // Une fois les événements récupérés, on récupère les inscriptions de l'utilisateur
      return  $http.get('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/mes-inscriptions', { headers })
              .then(function(response) {
                $scope.evenementsInscrits = response.data.map(inscription => inscription.evenement);
      });
      // On filtre les événements où l'id est présent dans les inscriptions
      $scope.evenementsInscrits = $scope.evenements.filter(event =>
        $scope.inscriptions.some(inscription => inscription.evenementId === event.id)
      );
    })
    .catch(function(error) {
      console.error("Erreur lors du chargement des inscriptions :", error);
    });
    
    
    
 // Supprimer un événement
    $scope.supprimerEvenement = function(id) {
      if (confirm('Supprimer cet événement ?')) {
        $http.delete('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/admin/evenement/' + id, { headers }).then(function() {
          $scope.evenements = $scope.evenements.filter(e => e.id !== id);
        });
      }
    };
    
// Supprimer une inscription
    // $scope.supprimerInscription = function(id) {
    //   if (confirm('Supprimer cette inscription ?')) {
    //     $http.delete('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/admin/evenement/' + id, { headers }).then(function() {
    //       $scope.evenements = $scope.evenements.filter(e => e.id !== id);
    //     });
    //   }
    // };

  $scope.modifierEvenement = function(id) {
      const event = $scope.evenements.find(e => e.id === id);
      if (event) {
        // Cloner l'événement pour éviter de modifier l'original sans confirmation
        $scope.eventToEdit = angular.copy(event);
        document.getElementById('popupEditEvent').classList.add('active');
     
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
