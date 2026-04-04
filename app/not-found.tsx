import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen p-8 flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
            <p className="mb-4">Could not find requested resource</p>
            <Link href="/" className="text-blue-500 hover:underline">
                Return Home
            </Link>
        </main>
    );
}
