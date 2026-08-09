import { Car, ListPlus, MonitorSmartphone, Network, Settings, Snowflake, Wrench } from "lucide-react";
import { useState } from "react";
import ServiceCard from "../../../../components/provider/applyProvider/ServiceCard";
import ProgressBar from "../../../../components/provider/applyProvider/ProgressBar";
import { Button } from "../../../../components/common/Button";
import { useNavigate } from "react-router-dom";

export default function ServiceSelection() {
  // State to track multiple selected services
    const [selectedServices, setSelectedServices] = useState<string[]>(['heavy-machinery']);
    const navigate = useNavigate()

  const toggleService = (id:string) => {
    setSelectedServices(prev => 
      prev.includes(id) 
        ? prev.filter(serviceId => serviceId !== id)
        : [...prev, id]
    );
  };

  const services = [
    {
      id: 'electronics',
      icon: MonitorSmartphone,
      title: 'Electronics',
      description: 'Repair and maintenance of consumer electronics, circuits, and appliances.'
    },
    {
      id: 'heavy-machinery',
      icon: Settings, 
      title: 'Heavy Machinery',
      description: 'Specialized industrial equipment, forklifts, and construction machinery.'
    },
    {
      id: 'hvac',
      icon: Snowflake,
      title: 'HVAC',
      description: 'Heating, ventilation, air conditioning, and refrigeration systems.'
    },
    {
      id: 'automotive',
      icon: Car,
      title: 'Automotive',
      description: 'Internal combustion engines, EVs, and heavy transport vehicles.'
    },
    {
      id: 'plumbing',
      icon: Wrench,
      title: 'Plumbing & Hydraulics',
      description: 'Complex fluid systems, pressure management, and waste disposal.'
    },
    {
      id: 'network-it',
      icon: Network,
      title: 'Network & IT',
      description: 'Data center maintenance, infrastructure, and server hardware.'
    }
  ];

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full bg-white min-h-full overflow-scroll hide-scrollbar">
      
      {/* Progress Bar Section */}
      <ProgressBar progress={33}/>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Service Specialization</h1>
        <p className="text-lg text-gray-600">
          Select the technical categories that best match your professional expertise. You can select multiple options.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            icon={service.icon}
            title={service.title}
            description={service.description}
            isSelected={selectedServices.includes(service.id)}
            onClick={() => toggleService(service.id)}
          />
        ))}
      </div>

      {/* Other Specializations Textarea */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-12">
        <div className="flex items-center gap-2 mb-4">
          <ListPlus className="h-5 w-5 text-[#545CEB]" />
          <h3 className="font-bold text-gray-900">Other Specializations</h3>
        </div>
        <textarea 
          className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 min-h-[120px] resize-y"
          placeholder="Tell us about any niche expertise or specific certifications you hold (e.g., Medical Grade Equipment, Avionics)..."
        ></textarea>
      </div>

      {/* Bottom Action Buttons */}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-6 mt-6 border-t border-gray-100">
              <Button variant="blue_outline" onClick={()=>navigate("/apply-provider/business")}>Back to Account</Button>
        
        <Button variant="blue">Continue to Documents</Button>
      </div>
      
    </div>
  );
}