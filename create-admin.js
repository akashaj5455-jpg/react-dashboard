const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Manually load .env since dotenv is not installed
const envPath = path.resolve(__dirname, '.env');
try {
    if (fs.existsSync(envPath)) {
        console.log(`Loading .env from ${envPath}`);
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join('=').trim();

                // Remove surrounding quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }

                if (key && value) {
                    process.env[key] = value;
                }
            }
        });
    } else {
        console.warn('.env file not found!');
    }
} catch (e) {
    console.error('Error loading .env:', e);
}

const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to database...');
    // Log masked connection string
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
        console.log(`DATABASE_URL found: ${dbUrl.substring(0, 15)}...`);
    } else {
        // Fallback for local sqlite if env missing
        process.env.DATABASE_URL = "file:./dev.db";
        console.log("Using fallback: file:./dev.db");
    }

    const email = 'admin@example.com';
    const password = 'password123';
    const hashedPassword = await hash(password, 10);

    console.log(`Creating/Updating admin user: ${email}`);

    // Using strings for SQLite
    const roleAdmin = 'ADMIN';
    const statusApproved = 'APPROVED';

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: roleAdmin,
            status: statusApproved
        },
        create: {
            email,
            password: hashedPassword,
            role: roleAdmin,
            status: statusApproved,
            name: 'Admin User'
        }
    });

    console.log(`✅ User created/updated successfully!`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${user.role}`);
    console.log(`Status: ${user.status}`);
}

main()
    .catch(e => {
        console.error('❌ Error creating user:', e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
