export default function Footer() {
  return (
    <footer className="bg-[#262626] text-white rounded-3xl md:rounded-[2.5rem] px-6 sm:px-10 md:px-16 py-10 md:py-16 mx-3 sm:mx-6 md:mx-8 mt-10 md:mt-16 mb-4 md:mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-10 md:mb-16 gap-4 md:gap-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold max-w-sm leading-tight">Simple way to hire with confidence</h2>
        <div className="text-base md:text-lg font-medium flex items-center gap-2">
          Made with <span className="text-red-500 text-xl">❤️</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        <div>
          <h4 className="text-gray-400 text-sm font-semibold mb-6">Discover</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-gray-300">Service by city</a></li>
            <li><a href="#" className="hover:text-gray-300">Service near by</a></li>
            <li><a href="#" className="hover:text-gray-300">All services</a></li>
            <li><a href="#" className="hover:text-gray-300">Elite Taskers</a></li>
            <li><a href="#" className="hover:text-gray-300">Become provider</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-400 text-sm font-semibold mb-6">Company</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-gray-300">About us</a></li>
            <li><a href="#" className="hover:text-gray-300">Careers</a></li>
            <li><a href="#" className="hover:text-gray-300">Partnerships</a></li>
            <li><a href="#" className="hover:text-gray-300">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-400 text-sm font-semibold mb-6">Projects</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-gray-300">Resources</a></li>
            <li><a href="#" className="hover:text-gray-300">Event</a></li>
            <li><a href="#" className="hover:text-gray-300">Media</a></li>
            <li><a href="#" className="hover:text-gray-300">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-400 text-sm font-semibold mb-6">Services</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-gray-300">Contact us</a></li>
            <li><a href="#" className="hover:text-gray-300">Support</a></li>
            <li><a href="#" className="hover:text-gray-300">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-400 text-sm font-semibold mb-6">Follow us</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-gray-300">Instagram</a></li>
            <li><a href="#" className="hover:text-gray-300">X</a></li>
            <li><a href="#" className="hover:text-gray-300">Facebook</a></li>
            <li><a href="#" className="hover:text-gray-300">Linkedin</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}