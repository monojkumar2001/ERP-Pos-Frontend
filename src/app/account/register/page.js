"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { authApi, ApiError } from "../../../lib/api";
import { saveSession } from "../../../lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    company: "",
    password: "",
    country: "+880",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.register({
        name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        company: form.company.trim(),
        phone: form.phone.trim() || null,
        country: form.country || null,
      });

      saveSession({
        token: data.token,
        user: data.user,
        company: data.company,
      });

      router.push("/en/dashboard");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
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

        {error ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-1 space-y-1">
          <AuthField
            id="fullName"
            label="Full name"
            value={form.fullName}
            onChange={onChange("fullName")}
            required
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
            required
          />
          <AuthField
            id="company"
            label="Company name"
            value={form.company}
            onChange={onChange("company")}
            required
          />
          <PasswordField
            id="password"
            label="Set a password"
            value={form.password}
            onChange={onChange("password")}
            required
          />
          <PrimaryButton disabled={loading}>
            {loading ? "Creating workspace..." : "Sign up now"}
          </PrimaryButton>
        </form>

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
