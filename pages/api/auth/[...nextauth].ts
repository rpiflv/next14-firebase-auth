import { auth,app } from "@/app/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import NextAuth from "next-auth/next";
import SessionStrategy from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { Adapter } from "next-auth/adapters";
import { cert } from "firebase-admin/app";
import { Session } from "inspector";

export const authOptions = {
    pages: {
        signIn: '/signin'
    },
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {},
        async authorize(credentials): Promise<any> {
            return await signInWithEmailAndPassword(auth, (credentials as any).email || "", (credentials as any).password || "")
            .then((userCredential) => {
                if (userCredential) {
                    console.log(userCredential.user.uid)
                    return { id: userCredential.user.uid, email: userCredential.user.email }
                }
            return null;
        }
        ).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            return null;
        });
        }
    })
    ],
}

export default NextAuth(authOptions);

