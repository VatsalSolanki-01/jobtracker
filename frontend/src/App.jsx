import { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem("jobtracker_token") || ""
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("jobtracker_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  const handleAuthSuccess = ({ token, user }) => {
    localStorage.setItem("jobtracker_token", token);
    localStorage.setItem("jobtracker_user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("jobtracker_token");
    localStorage.removeItem("jobtracker_user");

    setToken("");
    setUser(null);
  };

  useEffect(() => {
    if (!token) {
      localStorage.removeItem("jobtracker_token");
      localStorage.removeItem("jobtracker_user");
    }
  }, [token]);

  return (
    <div className="app-shell">
      {token && user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}