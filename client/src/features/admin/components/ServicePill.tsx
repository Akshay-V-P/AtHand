const ServicePill = ({ label, icon }) => (
  <div className="flex items-center space-x-2 bg-blue-100/50 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium border border-blue-200/50">
    <span className="text-blue-900">{icon}</span>
    <span>{label}</span>
  </div>
);

export default ServicePill