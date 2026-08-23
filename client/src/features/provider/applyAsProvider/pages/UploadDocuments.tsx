import { Briefcase, CloudUpload, IdCard, Info } from "lucide-react";
import FileUploadZone from "../../../../components/provider/applyProvider/FileUploadZone";
import RequiredBadge from "../../../../components/provider/applyProvider/RequiredBadge";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { uploadDocumentToS3 } from "../services/imageUploadService";
import { apiService } from "../services/apiService";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { setProvider } from "../store/providerSlice";
import { useNavigate } from "react-router-dom";
import type { IDocumentDetails } from "../../intefaces/IDocumentDetails";

interface IFileData {
    file?: File;
    url?: string;
    documentKey?: string;
    fileType: string;
}

interface IFileType {
    certifications: IFileData | null;
    businessLicense: IFileData | null;
    idFront: IFileData | null;
    idBack: IFileData | null;
}

export default function DocumentVerification() {
    const navigate = useNavigate()
    const provider = useAppSelector((state) => state.provider);
    const providerDraft = useAppSelector((state) => state.providerApplication);
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<IFileType>({
        certifications: null,
        businessLicense: null,
        idFront: null,
        idBack: null,
    });

    const [technicalCertificate, setTechnicalcertificate] = useState<IDocumentDetails|null>(null)
    const [businessLicense, setBusinessLicense] = useState<IDocumentDetails|null>(null)
    const [governmentIdFront, setGovernmentIdFront] = useState<IDocumentDetails|null>(null)
    const [governmentIdBack, setGovernmentIdBack] = useState<IDocumentDetails | null>(null)
    
    useEffect(() => {
        setTechnicalcertificate(providerDraft.documents.find(doc=>doc.documentType == "TECHNICAL CERTIFICATE") ?? null)
        setBusinessLicense(providerDraft.documents.find(doc=>doc.documentType == "BUSINESS LICENSE") ?? null)
        setGovernmentIdFront(providerDraft.documents.find(doc=>doc.documentType == "GOVERNMENT ID FRONT") ?? null)
        setGovernmentIdBack(providerDraft.documents.find(doc=>doc.documentType == "GOVERNMENT ID BACK") ?? null)
    },[])

    useEffect(() => {
        apiService
            .getProvider(provider.id!)
            .then((response) => {
                dispatch(setProvider(response.data.data));
            })
            .catch((error) => console.error(error));
    }, [provider]);


    useEffect(() => {
        if (providerDraft.documents && providerDraft.documents.length >= 1) {
            for (let doc of providerDraft.documents) {
                if (!doc.documentKey) continue;
                apiService
                    .getPresignedDisplayUrl(doc.documentKey)
                    .then((response) => {
                        switch (doc.documentType) {
                            case "TECHNICAL CERTIFICATE":
                                setFiles((prev) => ({
                                    ...prev,
                                    certifications: {
                                        url: response.data.data,
                                        documentKey:doc.documentKey,
                                        fileType: "TECHNICAL CERTIFICATE",
                                    },
                                }));
                                break;

                            case "BUSINESS LICENSE":
                                setFiles((prev) => ({
                                    ...prev,
                                    businessLicense: {
                                        url: response.data.data,
                                        documentKey:doc.documentKey,
                                        fileType: "BUSINESS LICENSE",
                                    },
                                }));
                                break;

                            case "GOVERNMENT ID FRONT":
                                setFiles((prev) => ({
                                    ...prev,
                                    idFront: {
                                        url: response.data.data,
                                        documentKey:doc.documentKey,
                                        fileType: "GOVERNMENT ID FRONT",
                                    },
                                }));
                                break;

                            case "GOVERNMENT ID BACK":
                                setFiles((prev) => ({
                                    ...prev,
                                    idBack: {
                                        url: response.data.data,
                                        documentKey:doc.documentKey,
                                        fileType: "GOVERNMENT ID BACK",
                                    },
                                }));
                                break;
                        }
                    })
                    .catch((error) => console.error(error));
            }
        }
    }, [providerDraft.documents]);

   

    const handleFileChange = (id: string, file: File, fileType: string) => {
        setFiles((prev) => ({
            ...prev,
            [id]: { file, fileType },
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            if (
                !files.businessLicense ||
                !files.certifications ||
                !files.idBack ||
                !files.idFront
            ) {
                toast.error("Please provide all documents");
                return;
            }

            const documents = [];

            if (!provider.id) {
                toast.error("Please login")
                return
            }

            for (const document of Object.values(files)) {
                if (!document) continue;

                if (document.file) {
                    const key = await uploadDocumentToS3(document.file);

                    const payload = {
                        providerId: provider.id,
                        documentKey: key,
                        documentType: document.fileType,
                    };

                    

                    const documentData =
                        await apiService.uploadDocument(payload);

                   console.log(documentData)
                    documents.push({...documentData.data.data, documentType:document.fileType});
                    
                } else if (document.documentKey) {
                    documents.push({
                        providerId:provider.id,
                        documentKey: document.documentKey,
                        documentType: document.fileType,
                    });
                }
            }


            await apiService.updateDraft({
                userId: user?.id!,
                documents,
            });

            await apiService.updateProvider(provider.id, { status: "PENDING" })
            navigate("/apply-provider/verify")
        } catch (error: any) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Something went wrong",
            );
        } finally {
            setIsLoading(false);
        }
    };

    

    return (
        <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full bg-white min-h-full overflow-y-scroll hide-scrollbar">
            {/* Progress Bar Section */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-3 text-sm font-bold tracking-wide">
                    <span className="text-[#545CEB] uppercase">
                        Step 3 of 3
                    </span>
                    <span className="text-gray-700">100% Complete</span>
                </div>
                <div className="w-full bg-blue-50 rounded-full h-2.5">
                    <div
                        className="bg-[#545CEB] h-2.5 rounded-full transition-all duration-500"
                        style={{ width: "100%" }}
                    ></div>
                </div>
            </div>

            {/* Header */}
            <div className="mb-10 max-w-3xl">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Document Verification
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                    To maintain our high service standards, we require
                    verification of your technical certifications and business
                    credentials. Most reviews are completed within 24 hours.
                </p>
            </div>

            {/* Layout Wrapper: flex on mobile, grid on desktop */}
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 items-start mb-8">
                {/* Left Column: Document Upload Forms */}
                <div className="order-1 lg:col-span-2 flex flex-col gap-6 w-full">
                    {/* Card 1: Technical Certifications */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-gray-900">
                                Technical Certifications
                            </h2>
                            <RequiredBadge badge={technicalCertificate?.verificationStatus} />
                        </div>
                        <p className="text-sm text-gray-500 mb-5">
                            Upload valid repair certifications or industry trade
                            licenses.
                        </p>

                        {technicalCertificate?.remarks ? 
                            <p className="opacity-80 text-red-500 p-4 text-sm border border-red-500 rounded-md mb-4">Remarks: {technicalCertificate?.remarks}</p>
                            :
                            ""
                        }
                        <FileUploadZone
                            id="certifications"
                            file={files.certifications?.file ?? files.certifications?.url ?? null}
                            onFileChange={handleFileChange}
                            fileType="TECHNICAL CERTIFICATE"
                            icon={CloudUpload}
                            title="Drag and drop your certification files"
                            subtitle="Image files only (JPG or PNG) up to 10MB"
                            showButton={true}
                            disabled={provider.status=="DRAFT" && technicalCertificate?.verificationStatus == "APPROVED" }
                        />
                    </div>

                    {/* Card 2: Business License */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-gray-900">
                                Business License
                            </h2>
                            <RequiredBadge badge={businessLicense?.verificationStatus} />
                        </div>
                        <p className="text-sm text-gray-500 mb-5">
                            Proof of registered business operation in your local
                            jurisdiction.
                            
                        </p>

                        {businessLicense?.remarks ? 
                            <p className="opacity-80 text-red-500 p-4 text-sm border border-red-500 rounded-md mb-4">Remarks: {businessLicense?.remarks}</p>
                            :
                            ""
                        }
                        <FileUploadZone
                            id="businessLicense"
                            file={files.businessLicense?.file ?? files.businessLicense?.url ?? null}
                            onFileChange={handleFileChange}
                            fileType="BUSINESS LICENSE"
                            icon={Briefcase}
                            title="Drop your business license here"
                            subtitle="High-resolution scans only (JPG, PNG)"
                            disabled={provider.status == "DRAFT" && businessLicense?.verificationStatus == "APPROVED"}
                        />
                    </div>

                    {/* Card 3: Government ID */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-gray-900">
                                Government ID
                            </h2>
                            <RequiredBadge badge={governmentIdFront?.verificationStatus} />
                        </div>
                        <p className="text-sm text-gray-500 mb-5">
                            A clear photo of your Passport, Driver's License, or
                            National ID.
                        </p>

                        {governmentIdFront?.remarks ? 
                            <p className="opacity-80 text-red-500 p-4 text-sm border border-red-500 rounded-md mb-4">Remarks: {governmentIdFront?.remarks}</p>
                            :
                            ""
                        }

                        {governmentIdBack?.remarks ? 
                            <p className="opacity-80 text-red-500 p-4 text-sm border border-red-500 rounded-md mb-4">Remarks: {governmentIdFront?.remarks}</p>
                            :
                            ""
                        }
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FileUploadZone
                                id="idFront"
                                file={files.idFront?.file ?? files.idFront?.url ??  null}
                                onFileChange={handleFileChange}
                                fileType="GOVERNMENT ID FRONT"
                                icon={IdCard}
                                title="Front Side"
                                disabled={provider.status=="DRAFT" && governmentIdFront?.verificationStatus == "APPROVED"}
                            />
                            <FileUploadZone
                                id="idBack"
                                file={files.idBack?.file ?? files.idBack?.url ?? null}
                                onFileChange={handleFileChange}
                                fileType="GOVERNMENT ID BACK"
                                icon={IdCard}
                                title="Back Side"
                                disabled={provider.status=="DRAFT" && governmentIdBack?.verificationStatus == "APPROVED"}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Tips (Sticks to the right on desktop) */}
                <div className="order-2 lg:col-span-1 w-full sticky top-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 text-gray-900">
                            <Info className="h-5 w-5 text-[#545CEB]" />
                            <h3 className="font-bold">Verification Tips</h3>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-3">
                            <li className="flex gap-2">
                                <span className="text-gray-400">•</span>
                                <span>Ensure all text is clearly readable</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-gray-400">•</span>
                                <span>Avoid glare or shadows in photos</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-gray-400">•</span>
                                <span>Documents must be currently valid</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-gray-400">•</span>
                                <span>Use full-color scans for licenses</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Action Area */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-6 mt-6 border-t border-gray-100">
                <button className="w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-[#545CEB] bg-white border border-[#545CEB] hover:bg-blue-50 transition-colors focus:ring-4 focus:ring-blue-100">
                    Back to Services
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white bg-[#545CEB] hover:bg-blue-700 shadow-sm transition-colors focus:ring-4 focus:ring-blue-200"
                >
                    {isLoading ? "Submitting..." : "Submit for Review"}
                </button>
            </div>
        </div>
    );
}
