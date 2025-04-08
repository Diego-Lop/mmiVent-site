app.controller('CommentairesController', ['$scope', '$http', 'CommentService', 'authService', function($scope, $http, CommentService, authService) {
    $scope.commentaireRecup = [];
    $scope.newComment = {};


    
    // Charger tous les commentaires
    $scope.rechargerCommentaires = function() {
        $http.get('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/commentaires')
            .then(function(response) {
                $scope.commentaireRecup = response.data;
            }, function(error) {
                console.error('Erreur lors de la récupération des commentaires :', error);
            });
    };

    // Ajouter un commentaire lié à un événement
    $scope.ajouterCommentaire = function(evenementId) {
        const token = authService.getToken();
        if (!token) {
            alert('Vous devez être connecté pour ajouter un commentaire.');
            return;
        }

        const commentaire = {
            contenu: $scope.newComment.description,
            evenementId: evenementId
        };

        CommentService.ajouterCommentaire(commentaire).then(function(response) {
            alert('Commentaire ajouté avec succès !');
            $scope.newComment = {};
            $scope.rechargerCommentaires(); // recharge immédiate
        }, function(error) {
            alert('Erreur : ' + (error.data.message || 'Erreur inconnue'));
        });
    };

    // Popup commentaire individuel
    $scope.openPopupCommentaire = function(contenu, id, nomEvenement, date) {
        $scope.commentaireCont = contenu;
        $scope.commentaireNomEvent = nomEvenement;
        $scope.commentaireDate = date;
        document.getElementById('popupCommentaire').classList.add('active');
    };

    $scope.closePopupCommentaire = function() {
        document.getElementById('popupCommentaire').classList.remove('active');
    };

    // Fermer popup si clic extérieur
    window.addEventListener('click', function(event) {
        const popup = document.getElementById('popupCommentaire');
        if (event.target === popup) {
            $scope.closePopupCommentaire();
        }
    });

 $scope.apercuCommentaire = function(commentaire) {
          const maxLength = 288;
          const texte = commentaire.contenu;
          if (texte.length > maxLength) {
            return texte.substring(0, maxLength) + '...';
          }
            return texte;
        };
    // Appel initial
    $scope.rechargerCommentaires();
}]);
