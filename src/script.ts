import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    const allWarehouses = await prisma.warehouse.findMany();
    console.log(allWarehouses);
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });