import { afterAll, beforeEach } from "vitest";
import { config } from "dotenv";

const result = config({ path: ".env.test", override: true });

if (result.error) {
    throw new Error("Не найден .env.test. Создайте его на основе .env.test.example.");
}

const requiredEnvironmentVariables = ["DATABASE_URL", "SESSION_SECRET"];
const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
    (name) => !process.env[name],
);

if (missingEnvironmentVariables.length > 0) {
    throw new Error(
        `В .env.test отсутствуют переменные: ${missingEnvironmentVariables.join(", ")}.`,
    );
}

const {default: prisma} = await import("../db.ts");

beforeEach(async () => {
    await prisma.session.deleteMany();
    await prisma.note.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});
