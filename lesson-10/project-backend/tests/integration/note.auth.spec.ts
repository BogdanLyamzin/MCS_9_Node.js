import request from "supertest";
import {describe, expect, it} from "vitest";

import { app } from "../../src/app.ts";

describe("GET /api/notes", ()=> {
    it("error GET notes without login", async()=> {
        const response = await request(app).get("/api/notes");

        expect(response.statusCode).toBe(401);
        expect(response.headers["content-type"]).toContain("application/json");
        expect(response.body).toMatchObject({
            error: {
                message: "User not found"
            }
        });
    })
})
