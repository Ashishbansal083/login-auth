
import * as cookie from "cookie";
import jwt from "jsonwebtoken";

const secret_key = "secret_key"; 

export function authenticate(req, res, next) {
    
  try {
    // Parse cookies from the request
    
    const cookies = cookie.parse(req.headers.cookie || "");
    
    const token = cookies.token;
    

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    //token Verify  
    const decoded = jwt.verify(token, secret_key);
    
    req.user = decoded; // Store user  in req.user
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}
