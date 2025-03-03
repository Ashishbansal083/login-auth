import { authenticate } from "../../../lib/authmiddleware";

export default async function handler(req, res) {
    authenticate(req, res, async () => {
      res.status(200).json({ message: "Protected route", user: req.user });
    });
  }