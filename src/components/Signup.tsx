'use client';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ChangeEvent, FormEvent, useState } from 'react';
import { auth, db } from '../app/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 



export default function Signup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordAgain, setPasswordAgain] = useState<string>('');
  const [terms, setTerms] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<string | null>(null);
  const [gender, setGender] = useState<string>('Not Specified');
  const [userName, setUserName] = useState<string>('');


  const router = useRouter();

  const handleProPic = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleGender = (e: ChangeEvent<HTMLSelectElement>) => {
    setGender(e.target.value)
  };

  const handleDateOfBirth = (e: ChangeEvent<HTMLInputElement>) => {
    setDateOfBirth(e.target.value)
  };


  const signup = async (e: FormEvent) => {
    e.preventDefault();
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    const storage = getStorage();
    const storageRef = ref(storage, `profile-pics/${userCredentials.user.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, profilePic!);

    uploadTask.on('state_changed', 
    (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error('Upload failed:', error);
      },
    () => {
        console.log('upload completed')
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            const userDoc = doc(db, 'users', userCredentials.user.uid);
            await setDoc(userDoc, {
              profilePic: downloadURL,
              dateOfBirth: dateOfBirth,
              gender: gender,
              userName: userName
            }, { merge: true });
            router.push('/signin');
          });
      }
  );
};
  
  return (
    <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Sign up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                Email address
              </label>
              <div className="mt-2">
                <input
                  data-testid="email"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  data-testid="password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="Password Again" className="block text-sm font-medium leading-6 text-white">
                  Password Again
                </label>
              </div>
              <div className="mt-2">
                <input
                  data-testid="confirm-password"
                  id="PasswordAgain"
                  name="PasswordAgain"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPasswordAgain(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                  Username
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="gender" className="block text-sm font-medium leading-6 text-white">
                  Gender
                </label>
              </div>
              <div className="mt-2 text-black">
              <select id="gender" name="gender" value={gender} onChange={handleGender}>
                <option value="Not Specified">Not Specified</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="dateofbirth" className="block text-sm font-medium leading-6 text-white">
                  Date of birth
                </label>
              </div>
              <div className="mt-2 text-black">
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                onChange={handleDateOfBirth}
                required
      />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="propic" className="block text-sm font-medium leading-6 text-white">
                  Profile Picture
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="propic"
                  name="propic"
                  type="file"
                  onChange={handleProPic}
                  required
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="tou" className="block text-sm font-medium leading-6 text-white">
                Terms of use
                </label>
              </div>
                <div className='flex items-start text-xs text-indigo-300'>
                <Link id='terms' href='https://menherasenpai.notion.site/457df49475494671807673a0a3346451'>
                  View terms of use
                </Link>
                </div>
              <div className="mt-2">
                <input
                  data-testid="checkbox-tou"
                  id="terms"
                  name="terms"
                  type="checkbox"
                  onChange={(e) => setTerms(prev => !prev)}
                  required
                />
              </div>
            </div>

            <div>
              <button
                disabled={(!email || !password || !passwordAgain || !terms) || (password !== passwordAgain)}
                onClick={(e) => signup(e)}
                className="disabled:opacity-40 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}