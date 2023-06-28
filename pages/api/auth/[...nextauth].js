import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb"
import { fetchUserById } from "../../../lib/dbFetch";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        try {
          const mongodbClient = new MongoClient(process.env.MONGO_DB_URI);
          await mongodbClient.connect();
          const db = mongodbClient.db(process.env.DB_NAME);
          const userCollection = db.collection("users");
          
          // Query for user with email and password
          const user = await userCollection.findOne({ email: email });
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (user) {
            if (!passwordMatch) {
              console.log("Password incorrect");
              return null;
            }
            const {_id, password: userPassword, ...userObj} = user;
            userObj["id"] = _id;
            return userObj;
          } else {
            console.log("User not found");
            return null;
          }
        } catch(err) {
          console.log(`User fetch error: ${err}`);
          return null;
        }
      }
    })
  ],
  session: {
    jwt: true,
    maxAge: 3000
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  callbacks: {
    async jwt({ token, trigger, user }) {
      if (token?.user?.id && trigger === "update") {
        const updatedUser = await fetchUserById(token.user.id);
        token.user = updatedUser;
      }

      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    }
  },
  pages: {
    signIn: "/sign-in"
  }
}

export default NextAuth(authOptions);