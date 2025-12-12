import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllPhotographers = () => prisma.photographer.findMany();

export const getPhotographer = (id: number) =>
  prisma.photographer.findUnique({ where: { id } });

export const getAllMediasForPhotographer = (photographerId: number) =>
  prisma.media.findMany({ where: { photographerId } });

export const incrementLike = (mediaId: number) =>
  prisma.media.update({
    where: { id: mediaId },
    data: { likes: { increment: 1 } },
    select: { id: true, likes: true },
  });
