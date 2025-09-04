import NextAuth from 'next-auth'

// Lazy load authOptions to avoid build-time evaluation
const getAuthOptions = async () => {
  const { authOptions } = await import('@/lib/auth')
  return authOptions
}

const handler = async (req: Request, context: any) => {
  const authOptions = await getAuthOptions()
  const nextAuthHandler = NextAuth(authOptions)
  return nextAuthHandler(req, context)
}

export { handler as GET, handler as POST }
