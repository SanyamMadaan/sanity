import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import google from "next-auth/providers/google";
import dbConnect from "./dbConnect";
import UserModel from "../model/User";
import { env } from "./env";
import Discord from "next-auth/providers/discord";
import LinkedIn from "next-auth/providers/linkedin";

export const authOptions = {
  providers: [
    google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    LinkedIn({
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
      authorization: { params: { scope: "r_liteprofile r_emailaddress" } },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "demo@demo.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.email },
            ],
          });

          if (!user) {
            console.error("User not found");
            return null;
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (isPasswordCorrect) {
            return {
              id: user._id.toString(),
              email: user.email,
              username: user.username,
              twoFactorActivated: user.twoFactorActivated,
            };
          } else {
            console.error("Incorrect password");
            return null;
          }
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile) {
        const { email, oauthId } = profile;
        try {
          await dbConnect();
          let existingUser = await UserModel.findOne({
            $or: [{ email: email }, { googleId: oauthId }],
          });

          if (!existingUser) {
            existingUser = new UserModel({
              email,
              password: null,
              googleId: oauthId,
              twoFactorActivated: true,
              createdAt: Date.now(),
              eventsRegistered: [],
            });

            await existingUser.save();
          }
          return true;
        } catch (error) {
          console.error(`Error signing in with ${account.provider}:`, error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id || user._id?.toString();
        token.twoFactorActivated = user.twoFactorActivated;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.twoFactorActivated = token.twoFactorActivated;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  secret: env.NEXTAUTH_SECRET,
};
