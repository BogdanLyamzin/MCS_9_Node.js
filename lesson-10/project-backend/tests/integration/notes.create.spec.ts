import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcrypt";

import prisma from "../../db.ts";
import { app } from "../../src/app.ts";

describe("POST /api/notes", ()=> {
    const credentials = {
        email: "test@gmail.com",
        password: "123456",
    };
    let agent: ReturnType<typeof request.agent>;
    let categoryId: number;

    beforeEach(async () => {
        await prisma.user.create({
            data: {
                email: credentials.email,
                passwordHash: await bcrypt.hash(credentials.password, 10),
                verify: true,
            }
        });
        const category = await prisma.category.create({
            data: {
                name: "work"
            }
        });
        categoryId = category.id;
        agent = request.agent(app);

        const loginResponse = await agent
            .post("/api/auth/login")
            .send(credentials);

        expect(loginResponse.statusCode).toBe(200);
    });

    it("create note with correctData for user", async()=> {
        const response = await agent.post("/api/notes").send({
            title: "Title 1",
            content: "Content 1",
            categoryId: categoryId
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            title: "Title 1",
            content: "Content 1",
            categoryId: categoryId
        });
        const savedNote = await prisma.note.findUnique({
            where: {
                id: response.body.id
            }
        });
        expect(savedNote).toMatchObject({
            id: response.body.id,
            title: "Title 1",
            content: "Content 1",
            categoryId,
        });
    })
})
