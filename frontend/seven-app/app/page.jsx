import Image from 'next/image';
import Link from 'next/link';
import React from 'react';


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-linear-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="text-center p-10 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-green-200">
        <div className="mb-6 p-4 bg-linear-to-br from-green-500 to-emerald-600 rounded-full inline-block shadow-lg animate-bounce">
          <Image src="/image/seven.png" alt="Seven Logo" width={120} height={120} className="rounded-full" />
        </div>
        <h1 className="text-5xl font-bold my-3 bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent ">
          Welcome to Seven Contacts!
        </h1>
        <h2 className="text-xl text-green-700 font-medium my-4">
          By Seven Advanced Academy Students
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Manage your contacts efficiently with our modern contact management system
        </p>
        <Link href="/dashboard">
          <button className="btn-primary px-10 py-4 text-lg rounded-xl cursor-pointer">
            View Dashboard
          </button>
        </Link>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-100/50 to-transparent pointer-events-none"></div>
    </div>
  );
}

