import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";

export default function AdminSetup() {
  const [email] = useState("misegundoingreso2023@gmail.com");
  const [password] = useState("75090298Juan");
  const [name] = useState("Administrador");
  const [secretKey, setSecretKey] = useState("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [, setLocation] = useLocation();

  const createAdminMutation = trpc.adminSetup.createAdmin.useMutation({
    onSuccess: (data) => {
      setResult(`✅ ${data.message}`);
      setError("");
      setTimeout(() => {
        setLocation("/auth");
      }, 2000);
    },
    onError: (error) => {
      setError(`❌ Error: ${error.message}`);
      setResult("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult("");
    setError("");

    createAdminMutation.mutate({
      email,
      password,
      name,
      secretKey,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Crear Usuario Administrador
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clave Secreta *
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Ingresa la clave secreta"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Clave: create-admin-2025
            </p>
          </div>

          {result && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
              {result}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={createAdminMutation.isPending || !secretKey}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {createAdminMutation.isPending ? "Creando..." : "Crear Administrador"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/auth"
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            ← Volver a Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  );
}
