"use client";

import { useState } from "react";
import { supabase } from "@/config/supabaseConfig";
import { useRouter } from "next/navigation";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) return setError("Please provide both email and password.");
    if (!isValidEmail(email)) return setError("Invalid email format.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.user) setSuccess("Signup successful! Please check your email to verify your account.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 position-relative overflow-hidden bg-animated">
      {/* Background Effect */}
      <div className="position-absolute top-0 start-0 w-100 h-100 stars"></div>

      {/* Card Container */}
      <div className="card p-4 text-center shadow-lg" style={{ maxWidth: "350px", borderRadius: "20px", backgroundColor: "#fff" }}>
        <h2 className="mb-3 text-primary">Create Account</h2>
        <p className="text-muted">Sign up to explore stories!</p>

        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        {/* Form Section */}
        <form onSubmit={handleSignUp}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
              <input
                type="password"
                className="form-control"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="btn btn-primary w-100">Sign Up</button>
          <p className="mt-3">Already have an account? <a href="/auth/login" className="text-primary">Login</a></p>
        </form>
      </div>
    </div>
  );
}
