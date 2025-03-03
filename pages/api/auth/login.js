import connectDB from "../../../lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../../models/Users";
import passport from "@/lib/passport";
import * as cookie from "cookie";

const secret_key = "secret_key"; // Store in environment variables

export default async function handler(req, res) {
  try {
    
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    await connectDB(); // Connect to database

    return new Promise((resolve, reject) => { 
      passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
          return res.status(500).json({ error: err.message  });
        }
        if (!user) {
          return res.status(401).json({ error: info?.message || "Invalid credentials" });
        }

        // Generate JWT token
        
        const token = jwt.sign({ id: user.id, email: user.email }, secret_key, {
          expiresIn: "1h",
        });
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

        res.status(200).json({ message: "Login successful" });
        resolve();
      })(req, res);
    });
  } catch (error) {
    console.error("Error in login handler:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
