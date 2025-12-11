/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const photographersData = require("../data/photographer.json");
const mediaData = require("../data/media.json");

async function main() {
  await prisma.photographer.createMany({
    data: photographersData
  });
console.log("Photographers inserted:", photographersData.length);

  await prisma.media.createMany({
    data: mediaData
  });
  console.log("Media inserted:", mediaData.lenght);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
