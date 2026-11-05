import { CheckCircle, Pencil, Lock } from "lucide-react";
import React, { useEffect, useRef, useState, type ElementType, type InputHTMLAttributes} from "react";

interface FileUploadZoneProps extends InputHTMLAttributes<HTMLInputElement>{
    id: string;
    file: File | string |null;
    onFileChange: (id: string, file: File, fileType:string) => void;
    fileType: string;
    icon?: ElementType;
    title: string;
    subtitle?: string;
    showButton?: boolean;
    disabled?: boolean; // <-- Add disabled prop
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
  disabled = false, // <-- Default to false
  className = "" 
}: FileUploadZoneProps) => {
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
    if (disabled) return; // <-- Block click if disabled
    fileInputRef.current?.click();
  };

  const handleFile = (e:React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
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
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200 min-h-[160px] ${
        disabled ? 'cursor-not-allowed opacity-90 bg-gray-100 border-gray-200' : 'cursor-pointer'
      } ${
        previewUrl && !disabled
          ? 'border-gray-200 bg-gray-50' 
          : 'border-gray-300 bg-gray-50/30 hover:bg-gray-100 hover:border-[#545CEB]/50 p-6'
      } ${className}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        disabled={disabled}
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFile}
      />

      {previewUrl ? (
        <div className="relative w-full h-full flex flex-col items-center group">
          <div className="w-full h-40 flex items-center justify-center bg-gray-100">
             <img 
               src={previewUrl} 
               alt={`${title} preview`} 
               className="w-full h-full object-contain"
             />
          </div>
          
          {/* Only show change overlay if NOT disabled */}
          {!disabled ? (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2 backdrop-blur-[2px]">
              <div className="bg-white text-gray-900 p-2 rounded-full shadow-lg">
                <Pencil className="h-5 w-5 text-[#545CEB]" />
              </div>
              <span className="text-white font-semibold text-sm drop-shadow-md">
                Click to change
              </span>
            </div>
          ) : (
            <div className="absolute top-2 right-2 bg-gray-900/70 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs">
              <Lock className="h-3 w-3" /> Locked
            </div>
          )}
          
          {typeof file !== 'string' && file?.name && (
            <div className="absolute bottom-0 inset-x-0 bg-white/90 border-t border-gray-100 p-2 text-center truncate px-4">
              <span className="text-xs font-medium text-gray-700 truncate block">
                {file.name}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          {Icon && <Icon className="h-8 w-8 text-gray-400 mb-3" />}
          <p className="text-sm font-bold text-gray-700">{title}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {showButton && !disabled && (
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