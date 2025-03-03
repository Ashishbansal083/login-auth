import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProtectedPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();

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

  if (!user) return <p>Loading...</p>;

  return <h1 className="mx-10 my-10 text-3xl">Welcome, {user.email}!</h1>;
}
