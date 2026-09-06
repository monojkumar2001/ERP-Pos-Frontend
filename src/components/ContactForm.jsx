"use client";

import { useState } from "react";

export default function ContactForm({
  fields = ["fullName", "email", "phone", "business", "message"],
  submitLabel = "Send message",
}) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-primary-light p-6 text-sm text-primary">
        Thank you! Your message has been received. Our team will contact you soon.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {fields.includes("fullName") && (
        <input
          required
          name="fullName"
          placeholder="Full name *"
          className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-sm outline-none focus:border-primary"
        />
      )}
      {fields.includes("business") && (
        <input
          name="business"
          placeholder="Business name"
          className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-sm outline-none focus:border-primary"
        />
      )}
      {fields.includes("email") && (
        <input
          required
          type="email"
          name="email"
          placeholder="Email address *"
          className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-sm outline-none focus:border-primary"
        />
      )}
      {fields.includes("phone") && (
        <input
          required
          name="phone"
          placeholder="Phone number *"
          className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-sm outline-none focus:border-primary"
        />
      )}
      {fields.includes("address") && (
        <input
          required
          name="address"
          placeholder="Full address *"
          className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-sm outline-none focus:border-primary"
        />
      )}
      {fields.includes("country") && (
        <select
          required
          name="country"
          defaultValue=""
          className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-sm outline-none focus:border-primary"
        >
          <option value="" disabled>
            Select a country
          </option>
          <option>Bangladesh</option>
          <option>India</option>
          <option>United States</option>
          <option>United Kingdom</option>
          <option>Other</option>
        </select>
      )}
      {fields.includes("package") && (
        <select
          name="package"
          defaultValue="Standard"
          className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-sm outline-none focus:border-primary"
        >
          <option>Basic</option>
          <option>Standard</option>
          <option>Premium</option>
          <option>Enterprise</option>
        </select>
      )}
      {fields.includes("users") && (
        <select
          name="users"
          defaultValue="1"
          className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-sm outline-none focus:border-primary"
        >
          <option value="1">1 user</option>
          <option value="2">2 users</option>
          <option value="3">3 users</option>
          <option value="10">10+ users</option>
        </select>
      )}
      {fields.includes("message") && (
        <textarea
          name="message"
          rows={4}
          placeholder="Message"
          className="w-full rounded-xl border border-line bg-soft px-4 py-3 text-sm outline-none focus:border-primary"
        />
      )}
      <button type="submit" className="btn-solid w-full">
        {submitLabel}
      </button>
    </form>
  );
}
