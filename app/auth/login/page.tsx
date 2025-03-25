"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logIn } from "@/app/utils/authFunctions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      router.push("/auth/profile");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary bg-gradient">
      <div className="card p-5" style={{ width: "400px" }}>
        <h1 className="text-center text-primary">WELCOME!</h1>
        <p className="text-center text-secondary">Login to continue</p>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <a href="#" className="d-block mb-3 text-primary">
            Forgot Password?
          </a>
          <button className="btn btn-primary w-100">LOGIN</button>
        </form>
        <div className="text-center mt-3">
          Don't have an account?{" "}
          <a href="/auth/signup" className="text-primary">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
