interface BadgeProps{
    text: string;
    type: string;
}

const Badge = ({ text, type }:BadgeProps) => {
  const styles = {
    provider: 'bg-blue-100 text-blue-700',
    transaction: 'bg-blue-100 text-blue-700',
    system: 'bg-gray-200 text-gray-700',
    payout: 'bg-blue-100 text-blue-700',
    security: 'bg-red-100 text-red-700',
    pending: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
    scheduled: 'bg-gray-200 text-gray-700',
    success: 'bg-green-100 text-green-700',
    investigating: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${styles[type.toLowerCase()] || styles.system}`}>
      {text}
    </span>
  );
};

export default Badge