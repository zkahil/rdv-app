"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
        setLoading(false);
        return;
      }

      // Attendre que la session soit mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Récupérer la session pour connaître le rôle
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();

      if (sessionData?.user) {
        const role = sessionData.user.role?.toUpperCase();
        console.log("👤 Rôle de l'utilisateur:", role);

        if (role === "ADMIN") {
          router.push("/dashboard");
        } else if (role === "VENDEUR") {
          router.push("/produits");
        } else {
          router.push("/");
        }
      } else {
        setError("Impossible de récupérer la session");
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Erreur:", error);
      setError("Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">RDV App</h1>
          <p className="text-gray-600 mt-2">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="admin@rdvapp.com"
            defaultValue="admin@rdvapp.com"
            required
          />
          <Input
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="admin123"
            defaultValue="admin123"
            required
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}