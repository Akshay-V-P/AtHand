import { CheckCircle, Pencil } from "lucide-react";
import React, { useEffect, useRef, useState, type ElementType, type InputHTMLAttributes} from "react";

interface FileUploadZoneProps extends InputHTMLAttributes<HTMLInputElement>{
    id: string;
    file: File | string |null;
    onFileChange: (id: string, file: File, fileType:string) => void;
    fileType: string;
    icon?: ElementType;
    title: string;
    subtitle?: string;
    showButton?:boolean
}

const FileUploadZone = ({ 
  id, 
  file, 
    onFileChange, 
  fileType,
  icon: Icon, 
  title, 
  subtitle, 
  showButton = false, 
  className = "" 
}:FileUploadZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string|null>(null);

    useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    if (typeof file === 'string') {
      setPreviewUrl(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFile = (e:React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileChange(id, selected, fileType);
    }
  
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer overflow-hidden transition-all duration-200 min-h-[160px] ${
        previewUrl 
          ? 'border-gray-200 bg-gray-50' 
          : 'border-gray-300 bg-gray-50/30 hover:bg-gray-100 hover:border-[#545CEB]/50 p-6'
      } ${className}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFile}
      />

      {previewUrl ? (
        // State: File Uploaded / Fetched from S3
        <div className="relative w-full h-full flex flex-col items-center group">
          {/* Image Preview */}
          <div className="w-full h-40 flex items-center justify-center bg-gray-100">
             <img 
               src={previewUrl} 
               alt={`${title} preview`} 
               className="w-full h-full object-contain"
             />
          </div>
          
          {/* Hover Overlay for Changing File */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2 backdrop-blur-[2px]">
            <div className="bg-white text-gray-900 p-2 rounded-full shadow-lg">
              <Pencil className="h-5 w-5 text-[#545CEB]" />
            </div>
            <span className="text-white font-semibold text-sm drop-shadow-md">
              Click to change
            </span>
          </div>
          
          {/* File Name (Only show if it's a new local File object, not a URL string) */}
          {typeof file !== 'string' && file?.name && (
            <div className="absolute bottom-0 inset-x-0 bg-white/90 border-t border-gray-100 p-2 text-center truncate px-4">
              <span className="text-xs font-medium text-gray-700 truncate block">
                {file.name}
              </span>
            </div>
          )}
        </div>
      ) : (
        // State: Default/Empty
        <div className="flex flex-col items-center text-center">
          {Icon && <Icon className="h-8 w-8 text-gray-400 mb-3" />}
          <p className="text-sm font-bold text-gray-700">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {showButton && (
            <button className="mt-4 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 bg-white shadow-sm pointer-events-none">
              Browse Files
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;