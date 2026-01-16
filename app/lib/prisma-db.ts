import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAllPhotographers = async () => {
  // await delay(3000);
  return prisma.photographer.findMany();
};

export const getPhotographer = async (id: number) => {
  // await delay(3000);
  return prisma.photographer.findUnique({ where: { id } });
};

export const getAllMediasForPhotographer = async (photographerId: number) => {
  // await delay(3000);
  return prisma.media.findMany({ where: { photographerId } });
};

export const incrementLike = async (mediaId: number) => {
  return prisma.media.update({
    where: { id: mediaId },
    data: { likes: { increment: 1 } },
    select: { id: true, likes: true },
  });
};

export const decrementLike = async (mediaId: number) => {
  // Récupérer l'état actuel
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    select: { likes: true }
  });

  if (!media) {
    throw new Error("Media not found");
  }

  // Ne pas décrémenter si déjà à 0
  if (media.likes <= 0) {
    throw new Error("Cannot decrement likes below 0");
  }

  return prisma.media.update({
    where: { id: mediaId },
    data: { likes: { decrement: 1 } },
    select: { id: true, likes: true },
  });
};
