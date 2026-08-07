import { describe, expect, test } from "vitest";

import { CreateNoteSchema } from "../../src/validators/note.validator.ts";

describe("test createNoteSchema", ()=> {
    test("create note with correct data", ()=> {
        const correctNote = {
            title: "Buy cat food",
            content: "Buy dry and warm food",
            categoryId: 1
        };

        const result = CreateNoteSchema.safeParse(correctNote);
        expect(result.success).toBe(true);
    })

    test("test content less then 3 symbols", ()=> {
        const invalidNote = {
            title: "Buy cat food",
            content: "Bu",
            categoryId: 1
        };
        const result = CreateNoteSchema.safeParse(invalidNote); 

        expect(result.success).toBe(false);

        if (result.success) {
            throw new Error("Ожидалась ошибка валидации");
        }

        expect(result.error.issues).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    path: ["content"],
                    code: "too_small",
                }),
            ]),
        );
    });

    test("accepts title and content at their minimum length", () => {
        const result = CreateNoteSchema.safeParse({
            title: "a".repeat(3),
            content: "b".repeat(3),
            categoryId: 1,
        });

        expect(result.success).toBe(true);
    });

    test("accepts title and content at their maximum length", () => {
        const result = CreateNoteSchema.safeParse({
            title: "a".repeat(100),
            content: "b".repeat(1000),
            categoryId: 1,
        });

        expect(result.success).toBe(true);
    });

    test("rejects a title longer than 100 symbols", () => {
        const result = CreateNoteSchema.safeParse({
            title: "a".repeat(101),
            content: "Valid content",
            categoryId: 1,
        });

        expect(result.success).toBe(false);
    });

    test("rejects content longer than 1000 symbols", () => {
        const result = CreateNoteSchema.safeParse({
            title: "Valid title",
            content: "a".repeat(1001),
            categoryId: 1,
        });

        expect(result.success).toBe(false);
    });

    test.each([
        [0, "zero"],
        [1.5, "fractional"],
        ["1", "string"],
    ])("rejects a %s categoryId", (categoryId, _label) => {
        const result = CreateNoteSchema.safeParse({
            title: "Valid title",
            content: "Valid content",
            categoryId,
        });

        expect(result.success).toBe(false);
    });
});

