<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\EvenementRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

final class AdminController extends AbstractController
{
    #[Route('/api/admin/evenements', name: 'admin_evenements', methods: ['GET'])]
public function getAllEvenements(EvenementRepository $evenementRepository): JsonResponse
{
    $evenements = $evenementRepository->findAll();
    $data = [];

    foreach ($evenements as $event) {
        $data[] = [
            'id' => $event->getId(),
            'nom' => $event->getNom(),
            'description' => $event->getDescription(),
            'date' => $event->getDate()->format('Y-m-d H:i:s'),
            'lieux' => $event->getLieux(),
            'photo' => $event->getPhoto(), // chemin ou nom de fichier
            'prix' => $event->getPrix(),
            'nombreDePlaces' => $event->getNombreDePlaces(),
            'nomOrganisme' => $event->getNomOrganisme(),
            'categories' => $event->getCategories(), // string ou tableau selon ton entité
        ];
    }

    return new JsonResponse([
        'total' => count($data),
        'evenements' => $data
    ]);
}

#[Route('/api/admin/evenement/{id}', name: 'admin_delete_evenement', methods: ['DELETE'])]
public function deleteEvenement(int $id, EntityManagerInterface $em, EvenementRepository $repo): JsonResponse
{
    $event = $repo->find($id);
    if (!$event) {
        return new JsonResponse(['error' => 'Événement introuvable'], 404);
    }
    $em->remove($event);
    $em->flush();

    return new JsonResponse(['message' => 'Événement supprimé.']);
}

#[Route('/api/admin/evenement/{id}', name: 'admin_update_evenement', methods: ['PUT'])]
public function updateEvenement(
    int $id,
    EntityManagerInterface $em,
    EvenementRepository $repo,
    \Symfony\Component\HttpFoundation\Request $request
): JsonResponse {
    $event = $repo->find($id);
    if (!$event) {
        return new JsonResponse(['error' => 'Événement introuvable'], 404);
    }

    $data = json_decode($request->getContent(), true);

    if (!$data) {
        return new JsonResponse(['error' => 'Données JSON invalides.'], 400);
    }

    if (isset($data['nom'])) {
        $event->setNom($data['nom']);
    }
    if (isset($data['date'])) {
        try {
            $date = new \DateTime($data['date']);
            $event->setDate($date);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Date invalide.'], 400);
        }
    }
    if (isset($data['places'])) {
        $event->setNombreDePlaces((int)$data['places']);
    }

    $em->flush();

    return new JsonResponse(['message' => 'Événement mis à jour avec succès.']);
}


#[Route('/api/admin/users', name: 'admin_users', methods: ['GET'])]
public function getAllUsers(UserRepository $userRepository): JsonResponse
{
    $users = $userRepository->findAll();
    $data = [];

    foreach ($users as $user) {
        $data[] = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ];
    }

    return new JsonResponse([
        'total' => count($data),
        'utilisateurs' => $data
    ]);
}

#[Route('/api/admin/user/{id}/toggle', name: 'admin_toggle_user', methods: ['PATCH'])]
public function toggleUser(int $id, EntityManagerInterface $em, UserRepository $repo): JsonResponse
{
    $user = $repo->find($id);
    if (!$user) {
        return new JsonResponse(['error' => 'Utilisateur introuvable.'], 404);
    }

    $user->setIsActive(!$user->getIsActive());
    $em->flush();

    return new JsonResponse(['message' => 'Utilisateur mis à jour.', 'isActive' => $user->getIsActive()]);
}
#[Route('/api/admin/user/{id}', name: 'admin_delete_user', methods: ['DELETE'])]
public function deleteUser(int $id, EntityManagerInterface $em, UserRepository $repo): JsonResponse
{
    $user = $repo->find($id);
    if (!$user) {
        return new JsonResponse(['error' => 'Utilisateur introuvable.'], 404);
    }

    $em->remove($user);
    $em->flush();

    return new JsonResponse(['message' => 'Utilisateur supprimé.']);
}


}
