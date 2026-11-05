interface FaqItemProp{
  question: string;
}

const FaqItem = ({ question }:FaqItemProp) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2 rounded-lg transition-colors">
    <span className="font-medium text-gray-800">{question}</span>
    <span className="text-gray-400 text-xl">+</span>
  </div>
);

export default FaqItem