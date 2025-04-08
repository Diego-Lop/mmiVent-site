<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Repository\EvenementRepository;
use App\Entity\Commentaire;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Evenement;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Repository\CommentaireRepository;
use App\Entity\Inscription;
use App\Repository\InscriptionRepository;
use Symfony\Bundle\SecurityBundle\Security;

class EvenementController extends AbstractController
{
    #[Route('/api/create', name: 'create_evenement', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $evenement = new Evenement();

        // Récupération des données envoyées en JSON
        $data = $request->request->all();

        // Gestion de l'upload de l'image
        $uploadedFile = $request->files->get('photo');

        if ($uploadedFile) {
            $uploadsDirectory = $this->getParameter('uploads_directory');
            $filename = uniqid() . '.' . $uploadedFile->guessExtension();
            $uploadedFile->move($uploadsDirectory, $filename);

            $evenement->setPhoto($filename);
        } else {
            return new JsonResponse(['error' => 'Aucune image n\'a été envoyée.'], 400);
        }

        // Enregistrement des autres données
        $evenement->setNom($data['nom']);
        $evenement->setDescription($data['description']);
        $evenement->setNombreDePlaces($data['nombreDePlaces']);
        $evenement->setDate(new \DateTime($data['date']));
        $evenement->setLieux($data['lieux']);
        $evenement->setPrix($data['prix']);
        $evenement->setNomOrganisme($data['nomOrganisme']);
        $evenement->setCategories($data['categories']);

        $em->persist($evenement);
        $em->flush();

        return new JsonResponse(['message' => 'Événement créé avec succès !']);
    }


    #[Route('/api/evenements', name: 'get_evenements', methods: ['GET'])]
    public function index(EvenementRepository $evenementRepository): JsonResponse
    {
        $evenements = $evenementRepository->findAll();

        $data = [];
        foreach ($evenements as $evenement) {
            $data[] = [
                'id' => $evenement->getId(),
                'nom' => $evenement->getNom(),
                'description' => $evenement->getDescription(),
                'nombreDePlaces' => $evenement->getNombreDePlaces(),
                'date' => $evenement->getDate()->format('Y-m-d H:i:s'),
                'lieux' => $evenement->getLieux(),
                'photo' => $evenement->getPhoto(),
                'prix' => $evenement->getPrix(),
                'nomOrganisme' => $evenement->getNomOrganisme(),
                'categories' => $evenement->getCategories(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/api/commentaires/add', name: 'add_commentaire', methods: ['POST'])]
    public function addCommentaire(Request $request, EntityManagerInterface $em, EvenementRepository $evenementRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['contenu'], $data['evenementId'])) {
            return new JsonResponse(['error' => 'Données manquantes'], 400);
        }

        $user = $this->getUser();
        $evenement = $evenementRepository->find($data['evenementId']);

        if (!$user || !$evenement) {
            return new JsonResponse(['error' => 'Utilisateur ou événement introuvable'], 404);
        }

        $commentaire = new Commentaire();
        $commentaire->setContenu($data['contenu']);
        $commentaire->setDate(new \DateTime());
        $commentaire->setUser($user);
        $commentaire->setEvenement($evenement);

        $em->persist($commentaire);
        $em->flush();

        return new JsonResponse(['message' => 'Commentaire ajouté avec succès !']);
    }

    #[Route('/api/commentaires', name: 'get_all_commentaires', methods: ['GET'])]
public function getAllCommentaires(CommentaireRepository $commentaireRepository): JsonResponse
{
    $commentaires = $commentaireRepository->findAll();
    $data = [];

    foreach ($commentaires as $commentaire) {
        $data[] = [
            'id' => $commentaire->getId(),
            'contenu' => $commentaire->getContenu(),
            'date' => $commentaire->getDate()->format('Y-m-d H:i:s'),
            'user' => $commentaire->getUser()->getEmail(),
            'evenement' => [
                'id' => $commentaire->getEvenement()->getId(),
                'nom' => $commentaire->getEvenement()->getNom(),
                'lieux' => $commentaire->getEvenement()->getLieux(),
                'date' => $commentaire->getEvenement()->getDate()->format('Y-m-d'),
            ]
        ];
    }

    return new JsonResponse($data);
}

#[Route('/api/evenements/{id}/inscription', name: 'inscription_evenement', methods: ['POST'])]
public function inscrire(
    int $id,
    Request $request,
    EntityManagerInterface $em,
    EvenementRepository $evenementRepository
): JsonResponse {
    $evenement = $evenementRepository->find($id);

    if (!$evenement) {
        return new JsonResponse(['error' => 'Événement introuvable.'], 404);
    }

    // Vérifier s’il reste des places
    $placesRestantes = $evenement->getNombreDePlaces();
    if ($placesRestantes <= 0) {
        return new JsonResponse(['error' => 'Plus aucune place disponible.'], 400);
    }

    // Vérifier que l'utilisateur est connecté
    $user = $this->getUser();
    if (!$user) {
        return new JsonResponse(['error' => 'Vous devez être connecté.'], 403);
    }

    // Vérifier s’il est déjà inscrit
    $inscriptionExistante = $em->getRepository(Inscription::class)->findOneBy([
        'user' => $user,
        'evenement' => $evenement
    ]);
    if ($inscriptionExistante) {
        return new JsonResponse(['error' => 'Vous êtes déjà inscrit à cet événement.'], 400);
    }

    // Récupérer nom et prénom dans le body
    $data = json_decode($request->getContent(), true);
    if (!isset($data['nom'], $data['prenom'])) {
        return new JsonResponse(['error' => 'Nom et prénom requis.'], 400);
    }

    // Créer l'inscription
    $inscription = new Inscription();
    $inscription->setUser($user);
    $inscription->setEvenement($evenement);
    $inscription->setNom($data['nom']);
    $inscription->setPrenom($data['prenom']);
    $inscription->setDateInscription(new \DateTime());

    $em->persist($inscription);

    // Décrémenter le nombre de places
    $evenement->setNombreDePlaces($placesRestantes - 1);

    $em->flush();

    return new JsonResponse(['message' => 'Inscription réussie !']);
}

#[Route('/api/mes-inscriptions', name: 'mes_inscriptions', methods: ['GET'])]
public function mesInscriptions(InscriptionRepository $inscriptionRepository, Security $security): JsonResponse
{
    $user = $security->getUser();
    $inscriptions = $inscriptionRepository->findBy(['user' => $user]);

    $result = [];

    foreach ($inscriptions as $inscription) {
        $evenement = $inscription->getEvenement();
        $result[] = [
            'id' => $inscription->getId(),
            'evenement' => [
                'id' => $evenement->getId(),
                'nom' => $evenement->getNom(),
                'date' => $evenement->getDate()->format('Y-m-d'),
                'lieux' => $evenement->getLieux(),
            ]
        ];
    }

    return $this->json($result);
}

}
?>
