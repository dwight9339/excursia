import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email/Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password", placeholder: "Password" }
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;
        try {
          const mongodbClient = new MongoClient(process.env.MONGO_DB_URI);
          await mongodbClient.connect();
          const db = mongodbClient.db(process.env.DB_NAME);
          const userCollection = db.collection("users");
          
          // Query for user with username and password
          const user = await userCollection.findOne({ username: username });
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (user) {
            if (!passwordMatch) {
              console.log("Password incorrect");
              return null;
            }
            const {_id, password: userPassword, ...userObj} = user;
            userObj["id"] = _id;
            console.log(`User: ${JSON.stringify(userObj)}`);
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
    async jwt({ token, user }) {
      if (user) {
        console.log(`JWT User: ${JSON.stringify(user)}`);
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    }
  }
}

export default NextAuth(authOptions);