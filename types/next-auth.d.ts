import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: {
        firstName: string;
        lastName: string;
      }
      preferences: {
        language: string;
        distanceUnit: string;
      }
    } & DefaultSession["user"]
  }
}