import React from 'react'

const AdminLogin = () => {
  return (
    <div className="min-h-screen flex w-full bg-[#F9FAFB]">
      {/* Left Column - Image & Branding (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 relative bg-indigo-900 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop')", // Placeholder soldering image
          }}
        />
        {/* Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-[#2e34a6]/90 z-10" />

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-center px-16 xl:px-24 w-full">
          <div>
            <h2 className="text-white text-2xl font-semibold flex items-center tracking-wide">
              At<span className="text-red-500 mx-0.5">.</span>Hand Admin Suite
            </h2>
            <div className="h-1 w-12 bg-emerald-400 mt-2 mb-6 rounded-full" />
            <h1 className="text-white text-5xl font-bold leading-tight mt-4">
              Precision in every<br />repair.
            </h1>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          
          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600 text-sm">
              Enter your credentials to manage your workshop.
            </p>
          </div>

          {/* Form */}
          <form>
            
            
          </form>
          
        </div>
      </div>
    </div>
  )
}

export default AdminLogin