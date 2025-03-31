import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export const authenticateUser = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1hr" }
    );

    res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
  })(req, res, next);
};

export const authenticateGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const handleGoogleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      console.log(err);
      return res.redirect(`http://localhost:3000/login?error=GoogleLoginFailed`);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    res.redirect(`http://localhost:3000/login?token=${token}`);
  })(req, res, next);
};
