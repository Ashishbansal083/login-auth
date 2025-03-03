import connectDB from '../../../lib/db';
import bcrypt from 'bcrypt';
import User from '../../../models/Users';

export default async function handler(req, res) {
  
  if (req.method === 'POST') {
    const { email, password } = req.body;
    

    try {
      await connectDB();
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });      
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'User registration failed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}