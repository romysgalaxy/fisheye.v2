/* eslint-disable @typescript-eslint/no-require-imports */

// Importation du client Prisma pour interagir avec la base de données
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importation des données JSON à insérer dans la base de données
const photographersData = require("../data/photographer.json");
const mediaData = require("../data/media.json");

// Fonction principale asynchrone pour insérer les données
async function main() {
  // Insertion en masse des photographes dans la table "photographer"
  await prisma.photographer.createMany({
    data: photographersData
  });
  console.log("Photographers inserted:", photographersData.length);
  // Insertion en masse des médias dans la table "media"
  await prisma.media.createMany({
    data: mediaData
  });
  console.log("Media inserted:", mediaData.length);
}

main()
  .then(async () => {
    // Fermeture propre de la connexion Prisma
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // Gestion des erreurs + fermeture de la connexion
    console.error(e);
    await prisma.$disconnect();
    process.exit(1); // On termine le process avec un code d'erreur
  });
