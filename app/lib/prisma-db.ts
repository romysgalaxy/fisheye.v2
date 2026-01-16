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
  // await delay(3000);
  return prisma.media.update({
    where: { id: mediaId },
    data: { likes: { increment: 1 } },
    select: { id: true, likes: true },
  });
};
