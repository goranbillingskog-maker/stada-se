"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Fel lösenord");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section" style={{ paddingTop: 64 }}>
      <div className="container" style={{ maxWidth: 380 }}>
        <div className="panel">
          <h1 style={{ fontSize: "1.3rem", marginBottom: 16 }}>Logga in på admin</h1>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error ? (
              <p style={{ color: "#a32d2d", fontSize: "0.9rem", margin: 0 }}>{error}</p>
            ) : null}
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Loggar in…" : "Logga in"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
