import { PrismaClient } from "@prisma/client";

// Instance unique de Prisma Client pour accéder à la base de données
const prisma = new PrismaClient();

/**
 * Récupère tous les photographes de la base de données
 */
export const getAllPhotographers = async () => {
  return prisma.photographer.findMany();
};

/**
 * Récupère un photographe par son ID
 */
export const getPhotographer = async (id: number) => {
  return prisma.photographer.findUnique({ where: { id } });
};

/**
 * Récupère tous les médias d'un photographe spécifique
 */
export const getAllMediasForPhotographer = async (photographerId: number) => {
  return prisma.media.findMany({ where: { photographerId } });
};

/**
 * Ajoute un like à un média (+1)
 */
export const incrementLike = async (mediaId: number) => {
  return prisma.media.update({
    where: { id: mediaId },
    data: { likes: { increment: 1 } },
    select: { id: true, likes: true },
  });
};

/**
 * Retire un like à un média (-1)
 * Empêche de descendre en dessous de 0
 */
export const decrementLike = async (mediaId: number) => {
  // Vérifier le nombre actuel de likes
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { likes: true }
  });

  if (!media) {
    throw new Error("Media not found");
  }

  // Ne pas autoriser les likes négatifs
  if (media.likes <= 0) {
    throw new Error("Cannot decrement likes below 0");
  }

  // Décrémenter le nombre de likes
  return prisma.media.update({
    where: { id: mediaId },
    data: { likes: { decrement: 1 } },
    select: { id: true, likes: true },
  });
};
