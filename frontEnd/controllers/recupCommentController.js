angular.module('monApp').controller('RecupCommentController', ['$scope', 'CommentService', function($scope, CommentService) {
    $scope.commentaireRecup = [];
    $scope.commentaireCont = ''; // pour la popup
    $scope.commentaireNomEvent = ''; // pour la popup
    $scope.commentaireDate = ''; // pour la popup


    $scope.rechargerCommentaires = function() {
        CommentService.getCommentaires().then(function(data) {
            $scope.commentaireRecup = data;
        });
    };

    // Appel initial
    $scope.rechargerCommentaires();

    // Fonction d'ouverture de popup
    $scope.openPopupCommentaire = function(contenu, id, titre, date) {
        // $scope.commentaireAffiche = id;
        $scope.commentaireNomEvent = titre;
        $scope.commentaireDate = date;
        $scope.commentaireCont = contenu;
        console.log( "comentaire affiché : " +  $scope.commentaireAffiche);

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
}]);
