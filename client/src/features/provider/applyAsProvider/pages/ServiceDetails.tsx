import { Car, ListPlus, MonitorSmartphone, Network, Settings, Snowflake, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ServiceCard from "../../../../components/provider/applyProvider/ServiceCard";
import ProgressBar from "../../../../components/provider/applyProvider/ProgressBar";
import { Button } from "../../../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { providerApplicationApi } from "../api/providerApplicationApi";
import { InputField } from "../../../../components/common/InputField";
import toast from "react-hot-toast";
import { useAppSelector } from "../../../../hooks/storeHook";

interface Category {
    id: string;
    name: string;
    description: string;
    slug: string;
    icon?: string;
    commissionPercentage: number;
    status: "ACTIVE" | "BLOCKED";
}

export default function ServiceSelection() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [services, setServices] = useState<Category[]>([])
  const [serviceRadius, setServiceRadius] = useState(5)
  const user = useAppSelector((state)=>state.auth.user)
    const navigate = useNavigate()

  const toggleService = (id:string) => {
    setSelectedServices(prev => 
      prev.includes(id) 
        ? prev.filter(serviceId => serviceId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    providerApplicationApi.getCategories()
      .then(response => setServices(response.data.data))
      .catch(error => console.error(error))
    
  }, [])

  const handleSubmit = async () => {
    try {
      if (selectedServices.length <= 0) {
        toast.error("Select a service category")
        return
      }
      const serviceDetails = {
        serviceCategory: selectedServices[0],
        serviceRadius: serviceRadius
      }

      const userId = user?.id
      if (!userId) {
        toast.error("Session expired! Please login")
        navigate("/login")
        return
      }

      const payload = {
        userId,
        serviceDetails
      }
      console.log(payload)

      await providerApplicationApi.updateDraft(payload)
      navigate("/apply-provider/documents")
    } catch (error:any) {
      console.error(error)
      toast.error(error.response.message || "Something went wrong")
    }
  }

  

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
            title={service.name}
            description={service.description}
            isSelected={selectedServices.includes(service.id)}
            onClick={() => toggleService(service.id)}
          />
        ))}
      </div>

      
      {/* <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-12">
        <div className="flex items-center gap-2 mb-4">
          <ListPlus className="h-5 w-5 text-[#545CEB]" />
          <h3 className="font-bold text-gray-900">Other Specializations</h3>
        </div>
        <textarea 
          className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 min-h-[120px] resize-y"
          placeholder="Tell us about any niche expertise or specific certifications you hold (e.g., Medical Grade Equipment, Avionics)..."
        ></textarea>
      </div> */}

      <div className="flex max-w-34 relative">
        <InputField type="number" placeholder="Service Radius" onChange={(e)=>setServiceRadius(Number(e.target.value.trim()))} defaultValue={5} inputLabel="Service Radius" className="max-w-20 outline-2 outline-gray-200" max={30} min={1}/>
      <p className="text-center pt-14 absolute bottom-0 left-22">Km</p>
      </div>

      {/* Bottom Action Buttons */}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-6 mt-6 border-t border-gray-100">
              <Button variant="blue_outline" onClick={()=>navigate("/apply-provider/business")}>Back to Account</Button>
        
        <Button variant="blue" onClick={handleSubmit}>Continue to Documents</Button>
      </div>
      
    </div>
  );
}