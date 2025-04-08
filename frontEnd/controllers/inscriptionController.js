app.controller('InscriptionController', ['$scope', '$http', 'authService', function($scope, $http, authService) {
    $scope.newInscription = {};

    $scope.inscriptionEvenement = function(evenementId) {
        const token = authService.getToken();

        if (!token) {
            alert('Vous devez être connecté pour vous inscrire.');
            return;
        }

        const formData = {
            nom: $scope.newInscription.nom,
            prenom: $scope.newInscription.prenom
        };

        const url = `https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/evenements/${evenementId}/inscription`;

        $http.post(url, formData, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function(response) {
            alert('Inscription réussie !');
            $scope.newInscription = {}; // reset du formulaire
        }, function(error) {
            console.error('Erreur lors de l’inscription :', error);
            alert('Erreur : ' + (error.data.message || 'Erreur inconnue'));
        });
    };
}]);
