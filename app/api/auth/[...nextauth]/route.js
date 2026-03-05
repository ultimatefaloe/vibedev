import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@utils/database";
import User from "@models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectDB();
        const user = await User.findOne({ email: session.user.email }).lean();
        if (user) {
          session.user.id = user._id.toString();
        }
      } catch (err) {
        console.error("[NextAuth session callback]", err);
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectDB();

        const existingUser = await User.findOne({ email: profile.email });

        if (!existingUser) {
          // Generate a safe username from name
          const baseUsername = profile.name
            .replace(/\s+/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9._]/g, "")
            .slice(0, 15);
          const username = `${baseUsername}${Math.floor(Math.random() * 9000) + 1000}`;

          await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }

        return true;
      } catch (err) {
        console.error("[NextAuth signIn]", err);
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };