"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AuthShell,
  AuthCard,
  AuthLogo,
  AuthText,
  GoogleButton,
  OrDivider,
  AuthField,
  PasswordField,
  PhoneField,
  PrimaryButton,
} from "../../../components/auth/AuthUI";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    company: "",
    password: "",
    country: "+880",
  });
  const [done, setDone] = useState(false);

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <AuthShell>
      <AuthCard>
        <div className="text-center">
          <AuthLogo />
          <AuthText>
            Welcome back! Get started with Softifybd. No credit card required. Get 14
            days free trial.
          </AuthText>
        </div>

        <GoogleButton />
        <OrDivider />

        {done ? (
          <div className="mt-4 rounded-lg bg-[#f5fbfa] p-4 text-center text-sm text-[#00a78b]">
            Account created successfully. You can now{" "}
            <Link href="/account/login" className="font-semibold underline">
              Sign in
            </Link>
            .
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-1 space-y-1">
            <AuthField
              id="fullName"
              label="Full name"
              value={form.fullName}
              onChange={onChange("fullName")}
            />
            <PhoneField
              value={form.phone}
              onChange={onChange("phone")}
              country={form.country}
              onCountryChange={onChange("country")}
            />
            <AuthField
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={onChange("email")}
            />
            <AuthField
              id="company"
              label="Company name"
              value={form.company}
              onChange={onChange("company")}
            />
            <PasswordField
              id="password"
              label="Set a password"
              value={form.password}
              onChange={onChange("password")}
            />
            <PrimaryButton>Sign up now</PrimaryButton>
          </form>
        )}

        <p className="mt-4 text-center text-sm font-normal leading-[1.4] tracking-wide text-[#20262e]">
          By proceeding, you agree to the{" "}
          <Link
            href="/terms-and-conditions"
            className="font-semibold text-[#00a78b] underline"
          >
            Terms & Condition↗
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="font-semibold text-[#00a78b] underline">
            Privacy Policy↗
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-[#282b2b]">
          Already have an account?{" "}
          <Link href="/account/login" className="font-semibold text-[#174f7d] underline">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
