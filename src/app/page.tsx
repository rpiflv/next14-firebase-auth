'use client'

import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import {auth, db} from "./firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { DocumentData } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";


interface UserData extends DocumentData {
  email: string;
}
export default function Home() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin')
    }
  });

  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setUser(docSnap.data() as UserData);
        } else {
          console.log("No such document!");
        }
      }
    });
    return getUser;
  }, []);
  
  user && console.log(user)
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex items-center flex-col mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="hover:opacity-90 flex flex-col items-center space-y-7 mb-5 border rounded-md border-indigo-500 border-[5] border-radius-[30px] p-6 hover:border-indigo-400 w-[320px] h-[620px]">
            <div className="relative h-[250px] w-[420px]">
            <Image src={user?.profilePic} alt={"img"} width={"120"} height={"120"} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hover:w-hover-img rounded-full border border-[2] hover:border-[8] border-indigo-800 p-2 hover:p-1 hover:rounded-none"/>
            </div>
            <div className="space-y-6">
              {user && user.userName}
            </div>
            <div className="space-y-20">
              {user && user.gender}
            </div>
            <div className="space-y-6">
              {user && user.dateOfBirth}
            </div>
          </div>
          <button className="disabled:opacity-40 flex w-full w-[320px] justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => {signOut(); router.push('/signin')}}>
              Sign out
          </button>
          </div>
        </div>
    </div>
  )
}

Home.requireAuth = true;