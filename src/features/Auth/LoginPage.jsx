import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMesej, setErrorMesej] = useState("");

  const kendaliLogin = async (e) => {
    e.preventDefault();
    setErrorMesej("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setErrorMesej("E-mel atau kata laluan salah! Sila semak semula.");
      } else {
        setErrorMesej(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">
            Sistem Kewangan
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            MASJID AL-MUJAHIDIN, Kampung Gudon, Sabah
          </p>
        </div>

        <form onSubmit={kendaliLogin} className="flex flex-col gap-2">
          <Input
            label="Alamat E-mel"
            id="email"
            type="email"
            placeholder="contoh: bendahari@gudon.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label="Kata Laluan"
            id="password"
            type="password"
            placeholder="Masukkan kata laluan anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {errorMesej && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold p-4 rounded-xl mb-2">
              {errorMesej}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mt-2">
            {loading ? "Sila tunggu..." : "Log Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
};
