angular.module('monApp').service('CommentService', ['$http', function($http) {
    let commentaires = [];

    this.getCommentaires = function(evenementId) {
        return $http.get('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/commentaires/')
            .then(function(response) {
                commentaires = response.data;
                return commentaires;
            });
    };

    this.ajouterCommentaire = function(commentaire) {
        return $http.post('https://event.lea.therasse.mmi-velizy.fr/mmievent3/public/index.php/api/commentaires/add', commentaire);
    };
}]);
