import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import type { UserRole } from "@/types/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          if (!user.email) {
            return false;
          }

          let dbUser = await User.findOne({
            email: user.email,
          });

          if (!dbUser) {
            dbUser = await User.create({
              name: user.name || "Google User",
              email: user.email,
              role: "patient",
              profileImage: user.image || "",
            });
          }

          return true;
        } catch (error) {
          console.error("Google SignIn Error:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      try {
        await connectDB();

        if (user?.email) {
          const dbUser = await User.findOne({
            email: user.email,
          });

          if (dbUser) {
            token.userId = dbUser._id.toString();
            token.role = dbUser.role as UserRole;
          }
        }

        if (!token.role) {
          token.role = "patient" as UserRole;
        }

        return token;
      } catch (error) {
        console.error("JWT Callback Error:", error);
        return token;
      }
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        session.user.role = token.role;
      }

      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/patient`;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };