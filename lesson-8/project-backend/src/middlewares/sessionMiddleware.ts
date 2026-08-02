import session from "express-session";
import connectPgSimple from "connect-pg-simple";

declare module "express-session" {
    interface SessionData {
        userId: number;
    }
}

// if(!process.env.SESSION_SECRET) {
//     throw new Error("Missing session secret")
// }

const pgStore = connectPgSimple(session);

const sessionMiddleware = session({
    store: new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET!,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24
    }
});

export default sessionMiddleware;