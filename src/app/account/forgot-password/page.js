"use client";

import { useState } from "react";
import {
  AuthShell,
  AuthCard,
  AuthLogo,
  AuthText,
  AuthField,
  PrimaryButton,
  AuthFooter,
} from "../../../components/auth/AuthUI";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
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
          <AuthText>Forgot your password? Enter your email to reset it.</AuthText>
        </div>

        {done ? (
          <div className="mt-6 rounded-lg bg-[#f5fbfa] p-4 text-center text-sm text-[#00a78b]">
            If an account exists for this email, a reset link has been sent.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-2 space-y-1">
            <AuthField
              id="email"
              label="Email address"
              type="email"
              placeholder="Type email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PrimaryButton>Reset password</PrimaryButton>
          </form>
        )}

        <AuthFooter
          text="Already have an account?"
          href="/account/login"
          linkLabel="Login"
        />
      </AuthCard>
    </AuthShell>
  );
}
