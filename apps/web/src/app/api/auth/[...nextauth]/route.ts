import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// Initialize NextAuth conditionally to avoid build-time errors
let handler: any

try {
  handler = NextAuth(authOptions)
} catch (error) {
  console.warn('NextAuth initialization failed during build, creating dummy handler')
  handler = () => new Response('NextAuth not available during build', { status: 503 })
}

export { handler as GET, handler as POST }
