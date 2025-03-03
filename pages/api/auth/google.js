import "../../../lib/passport";
import passport from "passport";
import connectDB from "../../../lib/db";
import User from "../../../models/Users";
import jwt from "jsonwebtoken";
import * as cookie from "cookie";



const secret_key = "secret_key"; // Store in environment variables



export default function handler(req, res, next) {
  if (!req.query.code) {
    // Step 1: Redirect user to Google login page
    console.log("ashish1");
    return passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  } else {
    // Step 2: Handle Google OAuth callback
    console.log("ashish2");

    passport.authenticate(
      "google",
      { failureRedirect: "/login" },
      (err, user) => {
        console.log(user);
        console.log(err);
        if (err) {
          console.log("ashish3");
          return res.redirect("/login");
        }

        if (!user) {
          console.log("ashish3 (No user found)");
          return res.redirect("/login");
        }

        console.log("ashish4 - User found:", user);

        if (user) {
          const token = jwt.sign(
            { id: user.googleId, email: user.email },
            secret_key,
            {
              expiresIn: "1h",
            }
          );
          // Set JWT in HTTP-only cookie
          res.setHeader(
            "Set-Cookie",
            cookie.serialize("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
              maxAge: 60 * 60, // 1 hour
            })
          );
          console.log("ashish6 - Login successful, redirecting...")
          return res.redirect("/protected");
        }

        // req.logIn(user, (err) => {
        //   if (err) {
        //     console.log("ashish5 - Error logging in:", err);
        //     return res.redirect("/login");
        //   }

        //   console.log("ashish6 - Login successful, redirecting...");
        //   return res.redirect("/protected"); // Redirect to dashboard after login
        // });
      }
    )(req, res, next);
  }
}
