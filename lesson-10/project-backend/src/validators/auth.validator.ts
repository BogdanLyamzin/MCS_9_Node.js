import {z} from "zod";

export const authSchema = z.object({
    email: z.string(),
    password: z.string().min(6)
});

export type AuthBody = z.infer<typeof authSchema>;