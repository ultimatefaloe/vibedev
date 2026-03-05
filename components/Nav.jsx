"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Nav() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0e0e10]/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/assets/images/logo.png" 
            alt="VibeDev Logo"
            width={100}
            height={100}
            className="w-25 h-25 p-2"
          />
          {/* <span className="text-white font-bold text-lg tracking-tight">
            vibe<span className="text-[#7c6af7]">dev</span>
          </span> */}
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm text-[#aaa] hover:text-white rounded-md hover:bg-white/[0.06] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/post/create"
            className="px-3 py-1.5 text-sm text-[#aaa] hover:text-white rounded-md hover:bg-white/[0.06] transition-colors"
          >
            New Post
          </Link>

          {session?.user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/[0.06] transition-colors"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="avatar"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-[#7c6af7] flex items-center justify-center text-xs text-white font-bold">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
                <span className="text-sm text-[#aaa] hover:text-white transition-colors">
                  Profile
                </span>
              </Link>
              <button
                onClick={() => signOut()}
                className="ml-1 px-3 py-1.5 text-sm text-[#aaa] hover:text-white rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="ml-1 px-4 py-1.5 text-sm font-medium text-white bg-[#7c6af7] hover:bg-[#6a59e0] rounded-md transition-colors cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 text-[#aaa] hover:text-white cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            {menuOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            ) : (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/[0.06] bg-[#0e0e10] px-4 py-3 flex flex-col gap-2">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-[#aaa] hover:text-white py-1"
          >
            Home
          </Link>
          <Link
            href="/post/create"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-[#aaa] hover:text-white py-1"
          >
            New Post
          </Link>
          {session?.user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-[#aaa] hover:text-white py-1"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="text-left text-sm text-[#aaa] hover:text-white py-1 cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                signIn("google");
                setMenuOpen(false);
              }}
              className="text-left text-sm text-[#7c6af7] font-medium py-1 cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
