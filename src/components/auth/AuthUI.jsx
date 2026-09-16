"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const AUTH_IMG = "https://account.softifybd.com";

export function AuthShell({ children }) {
  return (
    <div
      className="auth-bg-overlay relative flex min-h-screen w-full items-center justify-center overflow-auto px-4 py-10"
      style={{
        backgroundImage: `url(${AUTH_IMG}/images/auth-bg.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
}

export function AuthCard({ children }) {
  return (
    <div className="auth-card relative z-[2] w-full max-w-[448px] rounded-[20px] border-t-[6px] border-t-[#00a78b] bg-white px-6 py-6 shadow-[0_24px_72px_0_rgba(4,52,91,0.08)] sm:px-10">
      <div
        className="pointer-events-none absolute right-5 top-6 z-0 h-[72px] w-6 bg-contain bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: `url(${AUTH_IMG}/images/icons/pattern.svg)` }}
        aria-hidden
      />
      {children}
    </div>
  );
}

export function AuthLogo() {
  return (
    <div className="flex justify-center">
      <Image
        src={`${AUTH_IMG}/images/newLogo.png`}
        alt="Softifybd"
        width={150}
        height={48}
        className="h-12 w-auto max-w-[150px] object-contain"
        priority
      />
    </div>
  );
}

export function AuthText({ children }) {
  return (
    <p className="mt-3 text-center text-sm font-medium leading-[1.4] text-[#447197]">
      {children}
    </p>
  );
}

export function GoogleButton() {
  return (
    <button
      type="button"
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-transparent bg-[#fff8f0] px-2.5 py-2.5 text-base font-semibold leading-[1.4] text-[#282b2b] transition hover:border-[#00a78b]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${AUTH_IMG}/images/icons/google.svg`}
        alt="google"
        width={24}
        height={24}
      />
      Continue with Google
    </button>
  );
}

export function OrDivider() {
  return (
    <div className="relative z-[2] mt-3 text-center">
      <div className="absolute left-0 right-0 top-3 z-[-1] border-t-[1.5px] border-dashed border-[#bfd3e4]" />
      <span className="bg-white px-1 text-sm font-semibold leading-[1.4] text-[#174f7d]">
        OR
      </span>
    </div>
  );
}

export function AuthField({
  id,
  label,
  type = "text",
  placeholder = "",
  required = true,
  value,
  onChange,
  rightSlot,
  leftSlot,
}) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="relative left-3 top-2 z-[2] inline-block bg-white px-1 text-sm font-medium leading-[1.2] text-[#174f7d]"
      >
        {label}
      </label>
      <div className="relative">
        {leftSlot}
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`block w-full rounded-lg border-[1.5px] border-[#bfd3e4] bg-white px-3 py-3 text-base text-[#20262e] outline-none transition focus:border-[#00a78b] ${
            leftSlot ? "pl-[72px]" : ""
          } ${rightSlot ? "pr-11" : ""}`}
        />
        {rightSlot}
      </div>
    </div>
  );
}

export function PasswordField({
  id = "password",
  label = "Password",
  value,
  onChange,
  required = true,
}) {
  const [show, setShow] = useState(false);

  return (
    <AuthField
      id={id}
      label={label}
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      required={required}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#174f7d]"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
            <EyeOffIcon />
          ) : (
            <EyeIcon />
          )}
        </button>
      }
    />
  );
}

export function PhoneField({ value, onChange, country, onCountryChange }) {
  return (
    <div className="relative">
      <label
        htmlFor="phone"
        className="relative left-3 top-2 z-[2] inline-block bg-white px-1 text-sm font-medium leading-[1.2] text-[#174f7d]"
      >
        Phone number
      </label>
      <div className="flex overflow-hidden rounded-lg border-[1.5px] border-[#bfd3e4] focus-within:border-[#00a78b]">
        <select
          value={country}
          onChange={onCountryChange}
          className="border-r border-[#bfd3e4] bg-white px-2 text-sm text-[#174f7d] outline-none"
          aria-label="Selected country"
        >
          <option value="+880">🇧🇩 +880</option>
          <option value="+91">🇮🇳 +91</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+971">🇦🇪 +971</option>
        </select>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="01812-345678"
          value={value}
          onChange={onChange}
          className="w-full bg-white px-3 py-3 text-base text-[#20262e] outline-none"
        />
      </div>
    </div>
  );
}

export function PrimaryButton({ children, type = "submit", disabled = false }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className="mt-4 block h-12 w-full rounded-lg bg-[#00a78b] px-3 py-3 text-base font-medium leading-[1.5] text-white transition hover:bg-[#174f7d] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function AuthFooter({ text, href, linkLabel }) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-lg bg-[#fff8f0] px-3 py-[7px]">
      <p className="m-0 text-base font-medium leading-[1.5] text-[#282b2b]">{text}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-md border border-[#bfd3e4] bg-white px-3 py-1 text-base font-semibold leading-[1.5] text-[#174f7d] transition hover:text-[#00a78b]"
      >
        {linkLabel}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.8 21.8 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.9 21.9 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="m1 1 22 22" />
    </svg>
  );
}
