import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";

export default function ImportData() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const importMutation = trpc.importData.importAll.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setLoading(false);
    },
    onError: (error) => {
      setResult({ error: error.message });
      setLoading(false);
    },
  });

  const handleImport = async () => {
    const secret = prompt("Enter secret key:");
    if (!secret) return;

    setLoading(true);
    importMutation.mutate({ secret });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Import Data
        </h1>

        <div className="space-y-4">
          <button
            onClick={handleImport}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Importing..." : "Import Products & FAQs"}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h2 className="font-semibold text-lg mb-2">Result:</h2>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <button
            onClick={() => setLocation("/")}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors mt-4"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
