export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          VibeAgencies
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Launch your AI-powered digital agency in minutes
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg font-semibold transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  )
}