"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen p-8 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Try again
            </button>
        </main>
    );
}
