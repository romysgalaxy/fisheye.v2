/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export const getAllPhotographers = () => prisma.photographer.findMany();

export const getPhotographer = (id: number) =>
  prisma.photographer.findUnique({
    where: { id },
  });

export const getAllMediasForPhotographer = (photographerId: number) =>
  prisma.media.findMany({
    where: { photographerId },
  });

export const updateNumberOfLikes = (mediaId: number, newNumberOfLikes: number) =>
  prisma.media.update({
    where: { id: mediaId },
    data: { likes: newNumberOfLikes },
  });