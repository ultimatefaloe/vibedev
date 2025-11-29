import User from "@models/User";
import { connectionToDB } from "@utils/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });

      session.user.id = sessionUser._id.toString();

      return session;
    },

    async signIn({ profile }) {
      try {
        await connectionToDB();

        // checking if user exist
        const userExists = await User.findOne({
          email: profile.email,
        });

        const cleanUsername = profile.name
          .replace(/\s+/g, "")          
          .replace(/[^a-zA-Z0-9._]/g, "")
          .toLowerCase()


        // Create user if it doesnt exist
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: cleanUsername,
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.error(error);
        return flase;
      }
    },
  },
});
export { handler as GET, handler as POST };
