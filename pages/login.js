import { useState } from 'react';
import axios from 'axios';
import { useEffect} from "react";
import { useRouter } from "next/router";


export default function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [user, setUser] = useState(null);
    
  
    useEffect(() => {
      async function checkAuth() {
        try {
          const res = await fetch("/api/auth/protected", {
            method: "GET",
            credentials: "include", 
          });
          if (!res.ok) throw new Error("Not authenticated");
  
          const data = await res.json();
          setUser(data.user); // Set authenticated user
        } catch (error) {
          router.push("/login"); // Redirect to login if not authenticated
        }
      }
  
      checkAuth();
    }, []);

  const handleLogin = async () => {
    
    try {
      const response = await axios.post('/api/auth/login', { email, password });            
      router.push('/protected');      
    } catch (err) { 
      console.error('Login failed');
    }
  };

  return (!user ? 
    (<div className="bg-black/80 my-10 w-full md:w-3/12 px-12 py-6 mx-auto text-white rounded">
      <h1 className="text-2xl">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-6 py-4 my-2 w-full rounded bg-transparent border-slate-400 border"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-6 py-4 my-2 w-full rounded bg-transparent border-slate-400 border"
      />
      <button onClick={handleLogin} className="bg-blue-500 px-4 py-3 text-white w-full my-2 rounded font-semibold">
        Login
      </button>
      <div className="mt-4">
        <a href="/api/auth/google">Login with Google</a>
      </div>
      <div className="mt-4">
        <a href="/api/auth/facebook">Login with Facebook</a>
      </div>
    </div>) : router.push("/protected")
  );
}