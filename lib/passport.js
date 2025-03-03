
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/Users";
import bcrypt from "bcrypt";
import connectDB from "./db";


passport.use(
  new LocalStrategy(
    { usernameField: "email"},
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "User not found" });
        

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) return done(null, false, { message: "Incorrect password" });

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("google0")

      await connectDB();
      

      try {
        let user = await User.findOne({ googleId: profile.id });
        console.log("google1")

        if (!user) {
          console.log("google2")
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,            
          });
        }
        console.log("google3")

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/api/auth/google",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       let user = User.find((u) => u.googleId === profile.id);

//       if (!user) {

//         console.log("as1")
//       }
//       console.log("as2")

//       return done(null, user);
//     }
//   )
// );

export default passport;



// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: '/api/auth/facebook',
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // Example: Save user data to database or session
//       done(null, profile);
//     }
//   )
// );

passport.serializeUser(function (user, done) {
  done(null, user.username)
})
passport.deserializeUser(function (req, id, done) {
  const user = findUserByUsername(req, id)
  done(null, user)
})
