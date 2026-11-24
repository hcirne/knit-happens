"use client";

import { useState, useEffect } from "react";

const inputClass =
  "w-full rounded-lg border border-input-line bg-card px-4 py-2 text-ink";
const GENERIC_ERROR = "Something went wrong. Please try again.";

export default function AccountForm() {
  // status: "loading" | "loggedOut" | "error" | "ready" | "deleted"
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);
  const [reloadCount, setReloadCount] = useState(0); // bump to fetch again

  // Edit section
  const [values, setValues] = useState({ username: "", email: "" });
  const [editErrors, setEditErrors] = useState({});
  const [editBanner, setEditBanner] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete section (its errors are kept separate from the edit section)
  const [password, setPassword] = useState("");
  const [deleteErrors, setDeleteErrors] = useState({});
  const [deleteBanner, setDeleteBanner] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load the account when the page opens (and again on "Try again").
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch("/api/users/me");
        if (cancelled) return;
        if (response.status === 401) {
          setStatus("loggedOut");
        } else if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setValues({ username: data.user.username, email: data.user.email });
          setStatus("ready");
        } else {
          setStatus("error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  function retry() {
    setStatus("loading");
    setReloadCount(reloadCount + 1);
  }

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setEditErrors({});
    setEditBanner(null);
    setSaved(false);

    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.status === 200) {
        setUser(data.user);
        setValues({ username: data.user.username, email: data.user.email });
        setSaved(true);
      } else if (response.status === 400 || response.status === 409) {
        setEditErrors(data.fields || {});
        setEditBanner(data.error);
      } else {
        setEditBanner(GENERIC_ERROR);
      }
    } catch {
      setEditBanner(GENERIC_ERROR);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(event) {
    event.preventDefault();
    if (!window.confirm("Delete your account permanently?")) return;

    setDeleting(true);
    setDeleteErrors({});
    setDeleteBanner(null);

    try {
      const response = await fetch("/api/users/me", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();

      if (response.status === 200) {
        setStatus("deleted");
      } else if ([400, 403, 409].includes(response.status)) {
        setDeleteErrors(data.fields || {});
        setDeleteBanner(data.error);
      } else {
        setDeleteBanner(GENERIC_ERROR);
      }
    } catch {
      setDeleteBanner(GENERIC_ERROR);
    } finally {
      setDeleting(false);
    }
  }

  if (status === "loading") {
    return <p className="text-ink-soft">Loading your account…</p>;
  }

  if (status === "loggedOut") {
    return (
      <div>
        <p className="mb-6 text-ink-soft">You need to log in to see your account.</p>
        <a href="/login" className="inline-block rounded-full bg-pink px-6 py-2 font-medium text-ink">
          Log in
        </a>
        <p className="mt-6 text-ink-soft">
          No account yet?{" "}
          <a href="/register" className="font-medium text-ink underline decoration-pink decoration-2">Create one</a>
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-start gap-6">
        <div role="alert" className="rounded-lg bg-error-bg p-4 text-error">
          We couldn&apos;t load your account. Please try again.
        </div>
        <button type="button" onClick={retry} className="rounded-full bg-pink px-6 py-2 font-medium text-ink">
          Try again
        </button>
      </div>
    );
  }

  if (status === "deleted") {
    return (
      <div role="status">
        <h2 className="font-heading text-2xl font-bold">Your account was deleted.</h2>
        <p className="mt-2 mb-6 text-ink-soft">We hope to see you again.</p>
        <a href="/register" className="inline-block rounded-full bg-pink px-6 py-2 font-medium text-ink">
          Create a new account
        </a>
      </div>
    );
  }

  // status === "ready"
  return (
    <div className="flex flex-col gap-12">
      <form onSubmit={handleSave} noValidate className="flex flex-col gap-6">
        <p className="text-ink-soft">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>

        {editBanner && (
          <div role="alert" className="rounded-lg bg-error-bg p-4 text-error">{editBanner}</div>
        )}
        {saved && (
          <div role="status" className="rounded-lg bg-sage p-4 text-ink">Your changes were saved.</div>
        )}

        <Field label="Username" name="username" type="text"
          value={values.username} onChange={handleChange} error={editErrors.username} />
        <Field label="Email" name="email" type="email"
          value={values.email} onChange={handleChange} error={editErrors.email} />

        <button
          type="submit"
          disabled={saving}
          className="self-start rounded-full bg-pink px-6 py-2 font-medium text-ink disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      <form onSubmit={handleDelete} noValidate className="flex flex-col gap-6 border-t border-line pt-12">
        <h2 className="font-heading text-2xl font-bold">Delete account</h2>
        <p className="text-ink-soft">
          This is permanent. Accounts that still have projects or comments can&apos;t be deleted yet.
        </p>

        {deleteBanner && (
          <div role="alert" className="rounded-lg bg-error-bg p-4 text-error">{deleteBanner}</div>
        )}

        <Field label="Password" name="password" type="password" placeholder="Enter your password to confirm"
          value={password} onChange={(event) => setPassword(event.target.value)} error={deleteErrors.password} />

        <button
          type="submit"
          disabled={deleting}
          className="self-start rounded-full border border-error bg-card px-6 py-2 text-error disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete account"}
        </button>
      </form>
    </div>
  );
}

// One labelled input with its error message underneath.
function Field({ label, name, type, placeholder, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-medium">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass}
      />
      {error && <p id={`${name}-error`} className="text-error">{error}</p>}
    </div>
  );
}
