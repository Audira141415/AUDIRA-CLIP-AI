import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@audira/database';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "test@example.com" && credentials?.password === "password") {
          try {
            const user = await prisma.user.upsert({
              where: { email: "test@example.com" },
              update: {},
              create: {
                id: "1",
                email: "test@example.com",
                name: "Test User",
              }
            });

            await prisma.workspace.upsert({
              where: { id: "test-workspace" },
              update: {},
              create: {
                id: "test-workspace",
                name: "Default Workspace",
                ownerId: user.id
              }
            });

            await prisma.workspaceMember.upsert({
              where: {
                userId_workspaceId: {
                  userId: user.id,
                  workspaceId: "test-workspace"
                }
              },
              update: {},
              create: {
                userId: user.id,
                workspaceId: "test-workspace",
                role: "OWNER"
              }
            });
            
            return { id: user.id, name: user.name, email: user.email };
          } catch (error) {
            console.error("Failed to upsert test user:", error);
            return { id: "1", name: "Test User", email: "test@example.com" };
          }
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "audira-secret-key-development-only-12345",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
