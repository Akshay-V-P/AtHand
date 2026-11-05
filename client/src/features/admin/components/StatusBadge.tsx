const StatusBadge = ({ status }) => {
  const styles = {
    verified: 'bg-green-100 text-green-700',
    pending: 'bg-blue-100 text-blue-700',
    suspended: 'bg-red-100 text-red-700',
  };
  
  const dotStyles = {
    verified: 'bg-green-500',
    pending: 'bg-blue-500',
    suspended: 'bg-red-500',
  };

  const currentStyle = styles[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
  const currentDotStyle = dotStyles[status.toLowerCase()] || 'bg-gray-500';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${currentStyle}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${currentDotStyle}`}></span>
      {status}
    </span>
  );
};

export default StatusBadge