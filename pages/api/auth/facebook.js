import '../../../lib/passport';
import passport from 'passport';
import connectDB from '../../../lib/db';
import User from '../../../models/Users';

export default async function handler(req, res, next) {
  await connectDB();

  passport.authenticate('facebook', async (err, user, info) => {
    if (err) return res.redirect('/login');

    const existingUser = await User.findOne({ facebookId: user.id });
    if (!existingUser) {
      const newUser = new User({ facebookId: user.id, email: user.emails[0].value });
      await newUser.save();
    }

    res.redirect('/protected');
  })(req, res, next);
}