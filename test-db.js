
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Attempting to connect to the database...');
    try {
        await prisma.$connect();
        console.log('✅ Connection successful!');

        const count = await prisma.user.count();
        console.log(`Current user count: ${count}`);

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
