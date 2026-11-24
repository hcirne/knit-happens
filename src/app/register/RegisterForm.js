"use client";

import { useState } from "react";

const inputClass =
  "w-full rounded-lg border border-input-line bg-card px-4 py-2 text-ink";

export default function RegisterForm() {
  const [values, setValues] = useState({ email: "", username: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({}); // { email: "...", ... }
  const [banner, setBanner] = useState(null); // { message, showLogin }
  const [submitting, setSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setBanner(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.status === 201) {
        // Basic flow, step 7: confirmation and offer to log in.
        setCreatedUser(data.user);
      } else if (response.status === 400) {
        // A1 (invalid or incomplete data) and A2 (weak password).
        setFieldErrors(data.fields || {});
        setBanner({ message: data.error, showLogin: false });
      } else if (response.status === 409) {
        // A3: email already registered, offer to log in.
        setFieldErrors(data.fields || {});
        setBanner({ message: data.error, showLogin: true });
      } else {
        setBanner({ message: "Something went wrong. Please try again.", showLogin: false });
      }
    } catch {
      // Network failure or a response that was not JSON.
      setBanner({ message: "Something went wrong. Please try again.", showLogin: false });
    } finally {
      setSubmitting(false);
    }
  }

  if (createdUser) {
    return (
      <div role="status">
        <h2 className="font-heading text-2xl font-bold">Account created</h2>
        <p className="mt-2 mb-6 text-ink-soft">
          Welcome, {createdUser.username}! You can now log in.
        </p>
        <a href="/login" className="inline-block rounded-full bg-pink px-6 py-2 font-medium text-ink">
          Log in
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {banner && (
        <div role="alert" className="rounded-lg bg-error-bg p-4 text-error">
          {banner.message}
          {banner.showLogin && (
            <>
              {" "}
              <a href="/login" className="font-medium underline">Log in</a>
            </>
          )}
        </div>
      )}

      <Field label="Email" name="email" type="email" placeholder="e.g. knitter@example.com"
        value={values.email} onChange={handleChange} error={fieldErrors.email} />
      <Field label="Username" name="username" type="text" placeholder="e.g. woolwizard"
        value={values.username} onChange={handleChange} error={fieldErrors.username} />
      <Field label="Password" name="password" type="password" placeholder="Choose a password"
        value={values.password} onChange={handleChange} error={fieldErrors.password} />

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-full bg-pink px-6 py-2 font-medium text-ink disabled:opacity-60"
      >
        {submitting ? "Creating account…" : "Create account"}
      </button>

      <p className="text-ink-soft">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-ink underline decoration-pink decoration-2">Log in</a>
      </p>
    </form>
  );
}

// One labelled input with its error message underneath.
function Field({ label, name, type, placeholder, value, onChange, error }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-medium">{label} *</label>
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
