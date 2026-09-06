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
  PrimaryButton,
  AuthFooter,
} from "../../../components/auth/AuthUI";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

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
            Login successful (demo).{" "}
            <Link href="/en/dashboard" className="font-semibold underline">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-1 space-y-1">
            <AuthField
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-2 text-right">
              <Link
                href="/account/forgot-password"
                className="text-sm font-medium text-[#174f7d] underline"
              >
                Forgot your password?
              </Link>
            </div>
            <PrimaryButton>Login</PrimaryButton>
          </form>
        )}

        <AuthFooter
          text="Don’t have an account?"
          href="/account/register"
          linkLabel="Sign up"
        />
      </AuthCard>
    </AuthShell>
  );
}
