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
  PrimaryButton,
  AuthFooter,
} from "../../../components/auth/AuthUI";
import { authApi, ApiError } from "../../../lib/api";
import { saveSession } from "../../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.login({
        email: email.trim(),
        password,
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
          : "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthCard>
        <div className="mt-0 text-center">
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
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordField
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="mt-2 text-right">
            <Link
              href="/account/forgot-password"
              className="text-sm font-medium text-[#174f7d] underline"
            >
              Forgot your password?
            </Link>
          </div>
          <PrimaryButton disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </PrimaryButton>
        </form>

        <AuthFooter
          text="Don’t have an account?"
          href="/account/register"
          linkLabel="Sign up"
        />
      </AuthCard>
    </AuthShell>
  );
}
