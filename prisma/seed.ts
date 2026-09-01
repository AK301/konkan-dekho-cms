import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

const amenities = [
    "Wi-Fi",
    "Air Conditioning",
    "Swimming Pool",
    "Parking",
    "Restaurant",
    "Sea View",
    "Lift",
    "Breakfast",
    "Hot Water",
    "TV",
    "Refrigerator",
    "Kitchen",
    "Balcony",
    "Garden",
    "Pet Friendly",
];

async function main() {
    for (const name of amenities) {
        await prisma.amenity.upsert({
            where: {
                name,
            },
            update: {},
            create: {
                name,
            },
        });
    }

    console.log("Amenities seeded successfully.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });