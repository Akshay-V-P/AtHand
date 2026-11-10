import { OrderStatus } from "../enums/OrderStatus";
import { ServiceMode } from "../../../../shared/enums/ServiceMode";

export interface IAppointmentDetails {
    scheduledDate: Date;
    timeSlot?: string;
    serviceAddress?: any;
    accessInstructions?: string;
    confirmedAt?: Date;
}

export interface IDiagnosisDetails {
    summary?: string;
    identifiedIssues?: string[];
    completedAt?: Date;
}

export interface IEstimateItem {
    title: string;
    amount: number;
    type?: string;
}

export interface IRepairEstimate {
    items: IEstimateItem[];
    laborCost: number;
    partsCost: number;
    otherCharges?: number;
    totalAmount: number;
    estimatedRepairTime?: string;
    warranty?: string;
    notes?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';
    rejectionReason?: string;
    submittedAt?: Date;
    decidedAt?: Date;
}

export interface IWorkProofPhoto {
    url: string;
    caption: string;
}

export interface ICompletionDetails {
    notes?: string;
    workProofPhotos?: IWorkProofPhoto[];
    completedAt?: Date;
}

export interface IPaymentDetails {
    diagnosisFee?: number;
    repairFee?: number;
    totalAmount?: number;
    status: 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED' | 'UNPAID' ;
    paymentMethod?: string;
    paidAt?: Date;
    transactionReference?: string;
}

export interface IOrderReview {
    rating: number;
    comment?: string;
    reviewedAt?: Date;
}



export enum WorkStage {
    IN_TRANSIT = 'IN_TRANSIT',
  DIAGNOSIS = "DIAGNOSIS",
  REPAIR = "REPAIR",
  TESTING = "TESTING",
  READY_FOR_DELIVERY = "READY_FOR_DELIVERY",
}

export interface IOrder {
    id?: string;
    orderNumber: string;
    requestId: string;
    quoteId: string;
    providerId: string;
    customerId: string;
    serviceMode: ServiceMode;
    initialQuoteAmount: number;
    finalAmount?: number;
    isAmountRevised: boolean;
    revisionNotes?: string;
    status: OrderStatus;
    workStage: WorkStage;
    appointment?: IAppointmentDetails;
    diagnosis?: IDiagnosisDetails;
    repairEstimate?: IRepairEstimate;
    completionDetails?: ICompletionDetails;
    payment?: IPaymentDetails;
    review?: IOrderReview;
    createdAt?: Date;
    updatedAt?: Date;
}

