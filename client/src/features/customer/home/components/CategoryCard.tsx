interface CategoryCardProp {
  icon: string;
  title: string;
  subtitle: string;
  isActive?:boolean
}


const CategoryCard = ({ icon, title, subtitle, isActive }:CategoryCardProp) => (
  <div className={`flex flex-col items-start p-4 rounded-2xl min-w-[140px] min-h-35 sm:min-h-28 cursor-pointer transition-all border ${
    isActive ? 'bg-[#2A2A2A] text-white border-transparent shadow-md' : 'bg-white text-gray-800 border-2 border-[#DCDCDC] hover:border-gray-300'
  }`}>
    <div className="mb-3">{icon}</div>
    <h3 className="font-semibold text-sm">{title}</h3>
    <p className={`text-xs mt-1 ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>{subtitle}</p>
  </div>
);

export default CategoryCard