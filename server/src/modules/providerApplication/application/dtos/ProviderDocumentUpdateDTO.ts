import { DocumentVerificationStatus } from "../../../provider/domain/enums/DocumentVerificationStatus";

export interface ProviderDocumentUpdateDTO{
    documentType?: string;
    documentKey?: string;
    remarks?: string;
    verificationStatus?: DocumentVerificationStatus;
}