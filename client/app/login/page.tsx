"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import AuthBackground from "@/components/AuthBackground";
import AuthInput from "@/components/AuthInput";
import api from "@/services/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [justRegistered, setJustRegistered] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setJustRegistered(true);
    }
  }, [searchParams]);


 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("LOGIN FUNCTION CALLED");
  console.log(email, password);

  try {

    const res = await api.post("/auth/login", {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", res.data);


    localStorage.setItem(
      "token",
      res.data.token
    );


    console.log(
      "SAVED TOKEN:",
      localStorage.getItem("token")
    );


    router.push("/dashboard");


  } catch (error:any) {

    console.log(
      "LOGIN ERROR:",
      error.response?.data || error.message
    );

  }
};


  return (
    <main className="relative min-h-screen bg-[#050816] overflow-hidden flex items-center justify-center px-6">

      <AuthBackground />


      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-10">


        <div className="text-center">

          <h1 className="text-4xl font-bold text-white">
            Welcome Back 👋
          </h1>


          <p className="text-gray-400 mt-3">
            Continue your placement journey.
          </p>

          {justRegistered && (
            <p className="mt-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl py-2 px-3">
              Account created successfully. Please sign in.
            </p>
          )}

        </div>



        <form 
          onSubmit={handleLogin}
          className="mt-10 space-y-6"
        >


          <AuthInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />


          <AuthInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />



          <div className="flex items-center text-sm">

            <label className="flex items-center gap-2 text-gray-400">

              <input type="checkbox" />

              Remember me

            </label>


          </div>



         <button
  type="submit"
  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold hover:scale-[1.02] transition"
>
  Sign In
</button>


        </form>



        <p className="text-center mt-8 text-gray-400">

          Don't have an account?{" "}

          <Link
            href="/register"
            className="text-purple-400 cursor-pointer hover:underline"
          >
            Create Account
          </Link>

        </p>


      </div>


    </main>
  );
}