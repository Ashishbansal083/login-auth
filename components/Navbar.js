import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
      });

      if (res.ok) {
        console.log("Logout successful");
        router.push("/login"); // Redirect to login page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <nav className="flex items-center ">
      <ul className="flex px-8">
        <li className="p-2 border-b-2 border-gray-400 rounded-md shadow-md   mx-2 ">
          <Link href="/login">Login</Link>
        </li>
        <li className="p-2 border-b-2 border-gray-400 rounded-md shadow-md   mx-2">
          <Link href="/signup">Signup</Link>
        </li>
        <li className="p-2 border-b-2 border-gray-400 rounded-md shadow-md   mx-2">
          <Link href="/protected">Protected</Link>
        </li>
        <li className="p-2 border-b-2 border-gray-400 rounded-md shadow-md   mx-2">
          <Link href="/unprotected">Unprotected</Link>
        </li>
        <li className="bg-black/80 p-2 border-b-2 border-gray-400 rounded-md shadow-md   mx-2">
          <button
            onClick={handleLogout}
            className=" text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
