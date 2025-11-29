"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();
  // const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();
      console.log(response);
      setProviders(response);
    };

    setUpProviders();
  }, []);
  return (
    <nav className="flex-between items-center w-full mb-16 pt-3">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/logo.png"
          alt="Vibe Dev Logo"
          width={30}
          height={30}
        />
        <p className="logo_text blue_gradient">Vibe Dev</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-post" className="blue_btn">
              Create Post
            </Link>
            <button
              type="button"
              className="outline_btn cursor-pointer"
              onClick={() => {
                setToggleDropdown(false);
                signOut();
              }}
            >
              {" "}
              Sign Out
            </button>
            <Link href="/profile">
              <Image
                src={session?.user?.image}
                alt="profile-image"
                width={37}
                height={37}
                className="rounded-full"
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  className="blue_btn"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile navigation */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
            <Image
              src={session?.user?.image}
              alt="profile-image"
              width={37}
              height={37}
              className="rounded-full"
              onClick={() => setToggleDropdown((prev) => !prev)}
            />

            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_item"
                  onClick={() => setToggleDropdown((prev) => !prev)}
                >
                  My Profile
                </Link>
                <Link
                  href="/create-propmt"
                  className="dropdown_item"
                  onClick={() => setToggleDropdown((prev) => !prev)}
                >
                  Create Prompt
                </Link>
                <button
                  type="button"
                  className="blue_btn mt-5 w-full cursor-pointer"
                  onClick={() => {
                    setToggleDropdown(false);
                    signOut();
                  }}
                >
                  {" "}
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  className="blue_btn"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                >
                  Sign In
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
