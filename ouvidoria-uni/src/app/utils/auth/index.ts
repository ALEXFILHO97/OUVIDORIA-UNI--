import { loginUser } from "@/libs/utils/login-user";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) throw new Error("No credentials");

        const { email, password } = credentials;

        const user = await loginUser({ email, password });
        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],

  secret: 'asdjaoishoirhwqepis',

  pages: {
    signIn: "/admin/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
