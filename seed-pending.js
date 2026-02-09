const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hash } = require('bcryptjs');

async function main() {
    const email = 'pending_test@example.com';
    const password = await hash('password123', 10);

    // Check if user exists first
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log(`Test user ${email} already exists.`);
        return;
    }

    const user = await prisma.user.create({
        data: {
            name: 'Pending Test User',
            email: email,
            password: password,
            role: 'USER',
            status: 'PENDING'
        }
    });

    console.log(`Created pending user: ${user.email}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
