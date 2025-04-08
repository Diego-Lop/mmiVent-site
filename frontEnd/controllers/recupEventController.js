app.controller('RecupEventController', ['$scope', '$http', function($scope, $http) {
    $scope.events = [];
    $scope.evenementAffiche = null;
    $scope.filtreCategorie = '';

    // Récupération de tous les événements
    $http.get('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/evenements')
        .then(function(response) {
            $scope.events = response.data;
        }, function(error) {
            console.error('Erreur lors de la récupération des événements :', error);
        });

    $scope.ouvrirPopupEvenement = function(id) {
        const event = $scope.events.find(e => e.id === id);
        if (event) {
            $scope.evenementAffiche = event;
            document.getElementById('popupEvenement').classList.add('active');
            // document.getElementById('monBody').classList.add('no-scroll'); 
        }
    }; 
    $scope.fermerPopupEvenement = function() {
        $scope.evenementAffiche = null;
        document.getElementById('popupEvenement').classList.remove('active');
        // document.getElementById('monBody').classList.remove('no-scroll'); 
    };
       
   // Fermer la popup si l'utilisateur clique à l'extérieur du contenu
    window.addEventListener('click', function(event) {
        const popup = document.getElementById('popupEvenement');
        const contenu = document.querySelector('.popup-evenement-content');
    
        if (popup && contenu && event.target === popup) {
        // Utilise $apply si tu modifies un scope depuis un événement hors Angular
        const scope = angular.element(popup).scope();
        scope.$apply(function() {
            scope.fermerPopupEvenement();
        });
        }
    });
  
}]);
