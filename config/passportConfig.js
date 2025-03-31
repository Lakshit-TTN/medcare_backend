import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import fnv from "fnv-plus";
import pool from "./db.js";
import dotenv from "dotenv";
dotenv.config(); 

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
          return done(null, false, { message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user.rows[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (profile, done) => {
      try {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;
        const hashedId = fnv.hash(id).dec(); 
        const shortId = BigInt(hashedId) % BigInt(Number.MAX_SAFE_INTEGER);
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }
        const newUser = await pool.query(
          "INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *",
          [shortId, displayName, email]
        );
        return done(null, newUser.rows[0]);
        //the first argument is null because there is no error.
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
