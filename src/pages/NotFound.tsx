export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="text-6xl font-black text-neutral-900 mb-4">404</h1>
      <p className="text-xl text-neutral-600 mb-8">Page not found</p>
      <a href="/" className="px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors">
        Go Home
      </a>
    </div>
  );
}
