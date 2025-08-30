export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-500">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🎉 SPEKTIF AGENCY WORKS! 🎉
        </h1>
        <p className="text-xl text-gray-700 mb-4">
          If you can see this page, the servers are working!
        </p>
        <div className="space-y-2 text-sm">
          <p>✅ Frontend: Next.js running</p>
          <p>✅ Database: SQLite working</p>
          <p>✅ Backend: NestJS running</p>
        </div>
        <div className="mt-6">
          <a
            href="/tr"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Main Page
          </a>
          <a
            href="/tr/auth/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  )
}
