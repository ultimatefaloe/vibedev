import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@utils/database";
import User from "@models/User";

// authOptions is the plain config object — NOT the result of calling NextAuth()
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      try {
        await connectDB();
        const sessionUser = await User.findOne({
          email: session.user.email,
        }).lean();

        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
      } catch (error) {
        console.error("[NextAuth] session callback error:", error);
      }

      return session;
    },

    async signIn({ profile }) {
      try {
        await connectDB();

        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          const cleanUsername = profile.name
            .replace(/\s+/g, "")
            .replace(/[^a-zA-Z0-9._]/g, "")
            .toLowerCase()
            .slice(0, 15); // keep within the 5-20 char schema rule

          // Append random digits so short names still pass the min-length check
          const username = `${cleanUsername}${Math.floor(Math.random() * 9000) + 1000}`;

          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error("[NextAuth] signIn callback error:", error);
        return false; // was: `flase` — typo that caused a ReferenceError
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// NextAuth() is called exactly once, with the config object
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };