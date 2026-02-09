const { PrismaClient } = require('@prisma/client');
const { hash, compare } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'gdfgdtcbdse@gmail.com';
    const password = 'password123';

    console.log(`Checking user: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('❌ User not found!');
        return;
    }

    console.log('✅ User found.');
    console.log(`Stored Hash: ${user.password}`);

    const isMatch = await compare(password, user.password);

    if (isMatch) {
        console.log('✅ Password "password123" MATCHES the stored hash.');
    } else {
        console.error('❌ Password "password123" DOES NOT MATCH the stored hash.');

        console.log('🔄 Resetting password to "password123"...');
        const newHash = await hash(password, 10);

        await prisma.user.update({
            where: { email },
            data: { password: newHash }
        });

        console.log('✅ Password updated.');

        // Verify again
        const updatedUser = await prisma.user.findUnique({ where: { email } });
        const newMatch = await compare(password, updatedUser.password);
        console.log(`Verifying new hash: ${newMatch ? 'MATCH ✅' : 'FAIL ❌'}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
