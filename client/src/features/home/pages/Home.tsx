import React from 'react'
import { Button } from '../../../components/common/Button'
import CategoryCard from '../../../components/home/CategoryCard'
import ServiceCard from '../../../components/home/ServiceCard'
import FaqItem from '../../../components/home/FaqItem'
import ReviewCard from '../../../components/home/ReviewCard'

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      
      {/* 1. NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
          At<span className="text-red-500">.</span>Hand
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Services</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Become a Provider</a>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input type="text" placeholder="Search services..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200" />
            <span className="absolute left-4 top-2 text-gray-400 text-sm"><span className="material-symbols-outlined">
                        search
                      </span>
                      </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:block">Sign up</Button>
          <Button>Login</Button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 mt-4">
        <div className="bg-gradient-to-b from-[#d4f0ff] via-[#BFE7FF] to-[#FEFFE8] rounded-[2.5rem] p-6 sm:p-6 md:p-24 text-center flex flex-col items-center justify-center">
          <p className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-4 ">Troubleshoot problem before hiring</p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 max-w-3xl mx-auto">
            Simple way to hire with confidence
          </h1>
          <p className="text-gray-600 font-medium text-lg mb-10 max-w-xl mx-auto">
            Book verified local experts for home, office or personal needs - safe, reliable, and hassle-free.
          </p>
          
          {/* Ask AI Search Bar */}
          <div className="flex items-center bg-white/90 backdrop-blur-lg p-1.5 rounded-2xl w-full max-w-2xl h-14 shadow-xl border border-white/50">
            <span className="sm:pl-4 text-gray-400">✨</span>
            <input type="text" placeholder="What do you need help with?" className="flex-1 bg-transparent px-2 sm:px-4 py-3 text-xs md:text-sm focus:outline-none text-gray-800 placeholder-gray-400" />
            <Button className="rounded-xl !px-2 md:h-auto">Ask AI</Button>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Select Category</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar">
          <CategoryCard icon="📺" title="Electronics" subtitle="1245 Experts" isActive={true} />
          <CategoryCard icon="💻" title="Home Appliances" subtitle="842 Experts" />
          <CategoryCard icon="🔧" title="Home Maintenance" subtitle="2100 Experts" />
          <CategoryCard icon="🗑️" title="House Cleaning" subtitle="950 Experts" />
          <CategoryCard icon="📱" title="Education" subtitle="430 Experts" />
          <CategoryCard icon="📷" title="Photography" subtitle="320 Experts" />
        </div>
      </section>

      {/* 4. STATS & SERVICES (Gray Background Area) */}
      <div className="bg-[#F8F9FA] py-20">
        <div className="max-w-7xl  mx-auto px-4">
          
          <div className="flex flex-col gap-12 items-start justify-items-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-snug lg:w-1/2">
              At<span className="text-red-500">.</span>Hand connects you with top-rated neighborhood technicians for mechanical breakdowns, utility faults, and daily errands — <span className="text-gray-400">so you can feel at home instantly without worrying about overcharging.</span>
            </h2>
                      {/*  */}
                      {/* grid grid-cols-2 gap-8 lg:w-1/2 */}
            <div className="md:flex md:items-center md:justify-around w-full grid grid-cols-2 gap-8">
              <div><h4 className="text-3xl font-extrabold text-gray-900 text-center md:text-left">700k+</h4><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Electronics repaired</p></div>
              <div><h4 className="text-3xl font-extrabold text-gray-900 text-center md:text-left">1.5M+</h4><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Homes repaired</p></div>
              <div><h4 className="text-3xl font-extrabold text-gray-900 text-center md:text-left">1M+</h4><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Parts replaced</p></div>
              <div><h4 className="text-3xl font-extrabold text-gray-900 text-center md:text-left">80k+</h4><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Happy clients</p></div>
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Popular Services near you</h2>
            <p className="text-gray-500 font-medium mt-2">Find experts to help you get things done</p>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar justify-center">
            <ServiceCard title="Furniture Assembly" location="Kochi" price="₹499" rating="4.9" />
            <ServiceCard title="AC Servicing" location="Kochi" price="₹799" rating="4.8" />
            <ServiceCard title="Plumbing Repair" location="Kochi" price="₹399" rating="4.7" />
          </div>
        </div>
      </div>

      {/* 5. FAQ SECTION */}
      <section className="max-w-5xl mx-auto px-4 py-24 flex flex-col md:flex-row gap-16">
        <div className="md:w-1/3">
          <div className="w-16 h-16 border-2 border-gray-900 rounded-full flex items-center justify-center text-4xl font-light mb-6">?</div>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">Frequently<br/>asked<br/>questions</h2>
        </div>
        <div className="md:w-2/3 bg-gray-50/50 rounded-3xl p-6 md:p-8 border border-gray-100">
          <div className="space-y-2">
            <FaqItem question="How do I book a service?" />
            <FaqItem question="Are all providers verified?" />
            <FaqItem question="Can I reschedule or cancel a booking?" />
            <FaqItem question="What payment method do you accept?" />
            <FaqItem question="What is At.Hand AI?" />
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="mb-8">
          <div className="text-green-500 text-xl mb-2">★★★★★ <span className="text-sm text-gray-900 font-bold underline ml-2">4892 Reviews</span></div>
          <h2 className="text-3xl font-extrabold text-gray-900">Hear from our customers</h2>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar">
          <ReviewCard name="Sarah J." review="Booking a cleaner took less than 5 minutes, and the service was excellent. I love how easy it is to rebook." />
          <ReviewCard name="Mike T." review="The AI troubleshooting actually helped me fix my washing machine without needing to call someone! Saved me money." isHighlighted={true} />
          <ReviewCard name="Emily R." review="Professional and on time. The pricing was transparent and exactly what I was quoted in the app." />
        </div>
      </section>

      {/* 7. FOOTER */}
      <div className="p-4">
        <footer className="bg-[#2A2A2A] rounded-[2rem] p-12 md:p-16 text-white flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-xs">
            <h2 className="text-3xl font-extrabold leading-tight mb-4">Simple way to hire with confidence</h2>
            <p className="text-gray-400 text-sm mt-12">Made with ❤️</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div className="flex flex-col gap-3 text-gray-400">
              <h4 className="text-white font-bold mb-2">Discover</h4>
              <a href="#" className="hover:text-white transition-colors">Services by city</a>
              <a href="#" className="hover:text-white transition-colors">Our community</a>
              <a href="#" className="hover:text-white transition-colors">Gift cards</a>
              <a href="#" className="hover:text-white transition-colors">Elite Taskers</a>
              <a href="#" className="hover:text-white transition-colors">Become a Provider</a>
            </div>
            <div className="flex flex-col gap-3 text-gray-400">
              <h4 className="text-white font-bold mb-2">Company</h4>
              <a href="#" className="hover:text-white transition-colors">About us</a>
              <a href="#" className="hover:text-white transition-colors">Careers</a>
              <a href="#" className="hover:text-white transition-colors">Partnerships</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
            </div>
            <div className="flex flex-col gap-3 text-gray-400">
              <h4 className="text-white font-bold mb-2">Support</h4>
              <a href="#" className="hover:text-white transition-colors">Help Center</a>
              <a href="#" className="hover:text-white transition-colors">Contact us</a>
              <a href="#" className="hover:text-white transition-colors">Safety</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
            <div className="flex flex-col gap-3 text-gray-400">
              <h4 className="text-white font-bold mb-2">Connect</h4>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter (X)</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>

    </div>
  )
}

export default Home