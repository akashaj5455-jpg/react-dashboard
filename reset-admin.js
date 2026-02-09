const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hash } = require('bcryptjs');

async function main() {
    const email = 'gdfgdtcbdse@gmail.com';
    const password = await hash('password123', 10);

    await prisma.user.update({
        where: { email },
        data: { password }
    });

    console.log(`Reset password for ${email} to 'password123'`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
