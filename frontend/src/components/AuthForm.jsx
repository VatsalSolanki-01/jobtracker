import { useState } from "react";
import { api } from "../api";

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage("");
    setForm({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload =
        mode === "register"
          ? {
              name: form.name.trim(),
              email: form.email.trim(),
              password: form.password,
            }
          : {
              email: form.email.trim(),
              password: form.password,
            };

      const endpoint =
        mode === "register" ? "/auth/register" : "/auth/login";

      const response = await api.post(endpoint, payload);

      onAuthSuccess({
        token: response.data.token,
        user: response.data.user,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Authentication failed";

      setMessage(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Job Tracker</h1>
        <p className="auth-subtitle">
          Track your job applications with your own private dashboard.
        </p>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "tab-btn active-tab" : "tab-btn"}
            onClick={() => switchMode("login")}
            type="button"
          >
            Login
          </button>

          <button
            className={mode === "register" ? "tab-btn active-tab" : "tab-btn"}
            onClick={() => switchMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        {message && <div className="message error-message">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-btn auth-submit-btn">
            {mode === "register" ? "Create account" : "Login"}
          </button>
        </form>

        <p className="auth-footer-text">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="inline-switch-btn"
                onClick={() => switchMode("register")}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="inline-switch-btn"
                onClick={() => switchMode("login")}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}