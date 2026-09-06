"use client";

import { useEffect, useState } from "react";
import {
  AuthShell,
  AuthCard,
  AuthLogo,
  AuthText,
  AuthField,
  PasswordField,
  PrimaryButton,
  AuthFooter,
} from "../../../components/auth/AuthUI";
import { authApi, ApiError } from "../../../lib/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const requestCode = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const data = await authApi.forgotPassword({ email: email.trim() });
      setInfo(data.message || "Reset code sent");
      setSecondsLeft(data.code_expires_in || 300);
      setStep(2);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send reset code");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.resetPassword({
        email: email.trim(),
        reset_code: code.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
      setDone(true);
      setInfo(data.message || "Password updated");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reset password");
      if (err instanceof ApiError && err.data?.expired) setSecondsLeft(0);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await authApi.forgotPassword({ email: email.trim() });
      setInfo(data.message || "Reset code resent");
      setSecondsLeft(data.code_expires_in || 300);
      setCode("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend code");
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
            {step === 1
              ? "Forgot your password? Enter your email to get a reset code."
              : "Enter the 6-digit code from your email and set a new password."}
          </AuthText>
        </div>

        {error ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        {info ? (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {info}
          </div>
        ) : null}

        {done ? (
          <AuthFooter text="Password updated." href="/account/login" linkLabel="Login now" />
        ) : step === 1 ? (
          <form onSubmit={requestCode} className="mt-2 space-y-1">
            <AuthField
              id="email"
              label="Email address"
              type="email"
              placeholder="Type email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PrimaryButton disabled={loading}>
              {loading ? "Sending code..." : "Send reset code"}
            </PrimaryButton>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="mt-2 space-y-1">
            <AuthField
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AuthField
              id="reset_code"
              label="Reset code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit code"
              required
            />
            <PasswordField
              id="password"
              label="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordField
              id="password_confirmation"
              label="Confirm password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            <p
              className={`mt-2 text-center text-sm ${
                secondsLeft === 0 ? "font-semibold text-red-600" : "text-[#447197]"
              }`}
            >
              {secondsLeft === 0 ? "Code expired" : `Code expires in ${mm}:${ss}`}
            </p>
            <PrimaryButton disabled={loading || code.length !== 6}>
              {loading ? "Updating..." : "Reset password"}
            </PrimaryButton>
            <button
              type="button"
              onClick={resend}
              disabled={loading}
              className="mt-3 w-full text-center text-sm font-semibold text-[#174f7d] underline disabled:opacity-50"
            >
              Resend code
            </button>
          </form>
        )}

        {!done ? (
          <AuthFooter text="Already have an account?" href="/account/login" linkLabel="Login" />
        ) : null}
      </AuthCard>
    </AuthShell>
  );
}
