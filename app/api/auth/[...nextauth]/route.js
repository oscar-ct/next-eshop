import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcrypt";
import connectDB from "@/config/db";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            session: {
                strategy: "jwt",
            },
            pages: {
                signIn: '/login',
            },
            // // The name to display on the sign in form (e.g. "Sign in with...")
            // name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                await connectDB();
                const user = await User.findOne({email: credentials?.email});
                const passwordCorrect =  await bcrypt.compare(credentials?.password || "", user.password);
                if (passwordCorrect) {
                    return {
                        id: user._id,
                        email: user.email,
                        name: {username: user.name, userIsAdmin: user.isAdmin}
                    }
                }
                return null;

                // if (user) {
                //     // Any object returned will be saved in `user` property of the JWT
                //     return user
                // } else {
                //     // If you return null then an error will be displayed advising the user to check their details.
                //     return null
                //     // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                // }
            }
        })
    ]
});

export {handler as GET, handler as POST};