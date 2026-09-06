"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthShell } from "../../../components/auth/AuthUI";
import { authApi, ApiError } from "../../../lib/api";
import { saveSession } from "../../../lib/auth";

function ShieldIcon() {
  return (
    <div className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-[#3dd6b0] to-[#00a78b] shadow-[0_10px_30px_rgba(0,167,139,0.28)]">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3l7 3v5c0 4.5-2.9 8.4-7 9.5C7.9 19.4 5 15.5 5 11V6l7-3z"
          fill="white"
          fillOpacity="0.22"
        />
        <path
          d="M12 3.5l6.5 2.8v4.7c0 4-2.6 7.5-6.5 8.5-3.9-1-6.5-4.5-6.5-8.5V6.3L12 3.5z"
          stroke="white"
          strokeWidth="1.6"
        />
        <path
          d="M8.8 12.1l2.1 2.1 4.4-4.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function OtpInputs({ value, onChange, disabled }) {
  const inputsRef = useRef([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  const focusAt = (index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const update = (nextDigits) => {
    onChange(nextDigits.join("").slice(0, 6));
  };

  const handleChange = (index, raw) => {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      update(next);
      return;
    }

    // Paste or multi-digit into one box
    if (cleaned.length > 1) {
      const next = [...digits];
      cleaned.split("").forEach((d, i) => {
        if (index + i < 6) next[index + i] = d;
      });
      update(next);
      focusAt(Math.min(index + cleaned.length, 5));
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    update(next);
    if (index < 5) focusAt(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const next = [...digits];
        next[index] = "";
        update(next);
      } else if (index > 0) {
        focusAt(index - 1);
        const next = [...digits];
        next[index - 1] = "";
        update(next);
      }
      e.preventDefault();
    }
    if (e.key === "ArrowLeft" && index > 0) focusAt(index - 1);
    if (e.key === "ArrowRight" && index < 5) focusAt(index + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] || "");
    update(next);
    focusAt(Math.min(pasted.length, 5));
  };

  return (
    <div className="mt-6 flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          className="h-12 w-11 rounded-xl border border-[#c9d8e6] bg-white text-center text-xl font-semibold text-[#174f7d] outline-none transition focus:border-[#00a78b] focus:ring-2 focus:ring-[#00a78b]/25 sm:h-14 sm:w-12"
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);

  useEffect(() => {
    const q = searchParams.get("email");
    if (q) setEmail(q);
  }, [searchParams]);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const canResend = secondsLeft === 0;

  const onSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (code.length !== 6 || !email) return;
      setError("");
      setInfo("");
      setLoading(true);
      try {
        const data = await authApi.verify({
          email: email.trim(),
          verification_code: code.trim(),
        });
        saveSession({
          token: data.token,
          user: data.user,
          company: data.company,
        });
        router.push("/en/dashboard");
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Verification failed");
        if (err instanceof ApiError && err.data?.expired) setSecondsLeft(0);
      } finally {
        setLoading(false);
      }
    },
    [code, email, router]
  );

  useEffect(() => {
    if (code.length === 6 && !loading) {
      // auto-submit when all digits entered
    }
  }, [code, loading]);

  const onResend = async () => {
    if (!canResend || !email) return;
    setError("");
    setInfo("");
    setResending(true);
    try {
      const data = await authApi.resendVerification({ email: email.trim() });
      setInfo(data.message || "OTP resent successfully");
      setSecondsLeft(data.code_expires_in || 300);
      setCode("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-card relative z-[2] w-full max-w-[440px] rounded-[22px] border-t-[5px] border-t-[#09c3a2] bg-white px-6 py-8 shadow-[0_24px_72px_0_rgba(4,52,91,0.1)] sm:px-10">
      <ShieldIcon />

      <div className="mt-4 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-md bg-[#00a78b] px-3 py-1.5 shadow-sm">
          <span className="text-[13px] font-bold tracking-wide text-white">Softifybd</span>
          <span className="flex items-center gap-0.5 text-white/80" aria-hidden>
            <span className="text-[10px]">✕</span>
            <span className="text-[10px]">✕</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 13a5 5 0 007.07 0l2.12-2.12a5 5 0 00-7.07-7.07L11 4.93"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M14 11a5 5 0 00-7.07 0L4.81 13.12a5 5 0 007.07 7.07L13 19.07"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[10px]">✕</span>
            <span className="text-[10px]">✕</span>
          </span>
        </div>
      </div>

      <h1 className="mt-5 text-center text-[28px] font-bold leading-tight tracking-tight text-[#174f7d]">
        OTP Verification
      </h1>
      <p className="mt-2 text-center text-[14px] leading-[1.45] text-[#5f7388]">
        A 6-digit code was sent to:{" "}
        <span className="font-semibold text-[#174f7d]">{email || "your email"}</span>
      </p>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {info ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-700">
          {info}
        </div>
      ) : null}

      <form onSubmit={onSubmit}>
        <OtpInputs value={code} onChange={setCode} disabled={loading} />

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="mt-6 block h-12 w-full rounded-xl bg-[#00a78b] px-3 text-base font-semibold text-white transition hover:bg-[#078f78] disabled:cursor-not-allowed disabled:opacity-55"
        >
          {loading ? "Verifying..." : "Verify Account"}
        </button>
      </form>

      <div className="mt-5 text-center">
        <p className="m-0 text-[14px] text-[#5f7388]">Having trouble?</p>
        <p className="mt-1 text-[14px] text-[#5f7388]">
          {canResend ? (
            <span className="font-semibold text-red-500">OTP expired</span>
          ) : (
            <>
              Resend OTP in{" "}
              <span className="font-semibold text-[#00a78b]">
                {mm}:{ss}
              </span>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={onResend}
          disabled={!canResend || resending || !email}
          className={`mt-3 inline-flex h-10 min-w-[140px] items-center justify-center rounded-lg px-5 text-sm font-semibold text-white transition ${
            canResend
              ? "bg-[#00a78b] hover:bg-[#078f78]"
              : "cursor-not-allowed bg-[#9eb6c9]"
          }`}
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </div>

      <p className="mt-6 text-center text-[14px] text-[#5f7388]">
        Entered wrong details?{" "}
        <Link
          href="/account/register"
          className="font-semibold text-[#00a78b] hover:underline"
        >
          ← Back to sign up
        </Link>
      </p>
    </div>
  );
}

function VerifyFallback() {
  return (
    <div className="w-full max-w-[440px] rounded-[22px] border-t-[5px] border-t-[#09c3a2] bg-white px-6 py-16 text-center text-[#5f7388] shadow-[0_24px_72px_0_rgba(4,52,91,0.1)]">
      Loading OTP...
    </div>
  );
}

export default function VerifyPage() {
  return (
    <AuthShell>
      <Suspense fallback={<VerifyFallback />}>
        <VerifyForm />
      </Suspense>
    </AuthShell>
  );
}
