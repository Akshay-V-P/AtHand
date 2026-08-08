interface ServiceCardProp{
    title: string;
    location: string;
    price: string;
    rating: string;
}

const ServiceCard = ({ title, location, price, rating }:ServiceCardProp) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-w-[250px]">
    <div className="w-full h-32 bg-gray-200 rounded-xl mb-4"></div> {/* Image Placeholder */}
    <div className="flex items-center text-xs text-green-600 font-bold mb-1">
      <span className="mr-1">★ {rating}</span>
    </div>
    <h3 className="font-bold text-gray-900 text-lg leading-tight">{title}</h3>
    <div className="flex justify-between items-end mt-4">
      <span className="text-gray-500 text-sm">{location}</span>
      <span className="font-bold text-blue-600">{price}</span>
    </div>
  </div>
);

export default ServiceCard