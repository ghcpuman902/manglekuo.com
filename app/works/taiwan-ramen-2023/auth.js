import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'

// We default to using GitHub for authentication for local development and production.
// On Preview deployments, we use a dummy credentials provider. This allows folks to easily
// test the app without having to create a custom GitHub OAuth app or change the callback URL
// just to test the application on previews.

// We have a custom /sign-in page for non-preview environments. In preview environments, the user
// will be redirected to /api/auth/signin instead.
export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental
  // @ts-ignore
} = NextAuth({
  // @ts-ignore
  providers: [
    GoogleProvider({
      clientId: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    }),
  ],
  callbacks: {
    // @ts-ignore
    jwt: async ({ token, profile }) => {
      if (profile?.id) {
        token.id = profile.id
        token.image = profile.picture
      }
      return token
    },
    // @ts-ignore
    authorized({ auth }) {
      return !!auth?.user
    },
    trustHost: true
  },
})
