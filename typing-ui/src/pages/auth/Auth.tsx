import { useContext, useState } from "react";
import AuthContext from "../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";


const Auth = () => {
  const navigate = useNavigate()
  const { signin, signup } = useContext(AuthContext);
  const [isSignin, setIsSignin] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = isSignin
        ? await signin(email, password)
        : await signup(email, password);

      if (!success) {
        setError("Invalid credentials or user already exists.");
      } else {
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (err) {
      console.log(err)
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md h-80 mx-auto mb-20 p-6 border rounded shadow-md bg-white self-center">
      <h2 className="text-2xl font-bold mb-4">{isSignin ? "Sign In" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Processing..." : isSignin ? "Sign In" : "Sign Up"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <p className="mt-4 text-sm text-gray-600">
        {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => setIsSignin(!isSignin)}
        >
          {isSignin ? "Sign Up" : "Sign In"}
        </span>
      </p>
    </div>
  );
};

export default Auth;
