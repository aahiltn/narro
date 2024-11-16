'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white">
      <div className="text-center space-y-12 px-4">
        {/* Logo Section */}
        <div className="mb-8">
          <Image
            src="/Narro-logo.svg"
            alt="Narro Logo"
            width={188}
            height={36}
            className="mx-auto"
            priority
          />
        </div>

        <h1 className="text-6xl font-bold text-[#EA5658]">
          Welcome to Narro
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Picture Words, Ace Language
        </p>

        <Link
          href="/TeacherPage"
          className="inline-block px-8 py-4 text-lg font-semibold text-white 
                     bg-[#EA5658] rounded-full shadow-lg hover:bg-[#EB5759] 
                     transform hover:scale-105 transition-all duration-200 
                     ease-in-out"
        >
          Get Started →
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-8 text-center text-gray-500">
        <p>© 2024 Narro. All rights reserved.</p>
      </div>

      {/* Optional: Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#EA5658] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
    </main>
  );
}
