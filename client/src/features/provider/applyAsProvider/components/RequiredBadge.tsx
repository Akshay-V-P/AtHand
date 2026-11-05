const RequiredBadge = ({ badge }: { badge?: string }) => {
  const bg = {
    APPROVED: "text-green-600 bg-green-50",
    REJECTED: "text-red-600 bg-red-50",
    PENDING: "text-yellow-600 bg-yellow-50",
    REQUIRED:"text-[#545CEB] bg-blue-50"
  }
  
  return (
  <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase ${badge? bg[badge]:bg["REQUIRED"]}`}>
    {badge || "Required"}
    </span>
  )
};

export default RequiredBadge