interface ReviewCardProp{
    name: string;
    review: string;
    isHighlighted?:boolean
}

const ReviewCard = ({ name, review, isHighlighted }:ReviewCardProp) => (
  <div className={`p-6 rounded-2xl min-w-[300px] border ${
    isHighlighted 
      ? 'bg-gradient-to-br from-[#d4f0ff] via-[#e4f6fb] to-[#f6fbe3] border-transparent shadow-sm' 
      : 'bg-white border-gray-200'
  }`}>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-full bg-gray-300"></div> {/* Avatar */}
      <span className="font-bold text-sm text-gray-900">{name}</span>
    </div>
    <p className="text-gray-800 font-medium text-sm leading-relaxed">"{review}"</p>
  </div>
);

export default ReviewCard