export type OrderStatus =
    | 'pending'
    | 'scheduled'
    | 'device_received'
    | 'diagnosis_in_progress'
    | 'estimate_pending_approval'
    | 'estimate_rejected'
    | 'repair_in_progress'
    | 'waiting_for_payment'
    | 'completed'
    | 'closed_without_repair'
    | 'cancelled';

export type ServiceMode = 'ONSITE' | 'WORKSHOP' | 'COLLECTION_AND_RETURN';

export interface IAppointmentDetails {
    scheduledDate: string | Date;
    timeSlot?: string;
    serviceAddress?: any;
    accessInstructions?: string;
    confirmedAt?: string | Date;
}

export interface IDiagnosisDetails {
    summary?: string;
    identifiedIssues?: string[];
    completedAt?: string | Date;
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
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    submittedAt?: string | Date;
    decidedAt?: string | Date;
}

export interface IWorkProofPhoto {
    url: string;
    caption: string;
}

export interface ICompletionDetails {
    notes?: string;
    workProofPhotos?: IWorkProofPhoto[];
    completedAt?: string | Date;
}

export interface IPaymentDetails {
    diagnosisFee?: number;
    repairFee?: number;
    totalAmount?: number;
    status: 'PENDING' | 'PAID' | 'REFUNDED';
    paymentMethod?: string;
    paidAt?: string | Date;
    transactionReference?: string;
}

export interface IOrderReview {
    rating: number;
    comment?: string;
    reviewedAt?: string | Date;
}

export interface Order {
    id: string;
    _id?: string;
    orderNumber: string;
    requestId: string | any;
    quoteId: string;
    providerId: string | any;
    customerId: string | any;
    serviceMode: ServiceMode;
    initialQuoteAmount: number;
    finalAmount?: number;
    isAmountRevised: boolean;
    revisionNotes?: string;
    status: OrderStatus;
    appointment?: IAppointmentDetails;
    diagnosis?: IDiagnosisDetails;
    repairEstimate?: IRepairEstimate;
    completionDetails?: ICompletionDetails;
    payment?: IPaymentDetails;
    review?: IOrderReview;
    createdAt?: string;
    updatedAt?: string;
}

export interface AcceptQuoteDTO {
    quoteId: string;
    appointmentDate?: string;
    timeSlot?: string;
    accessInstructions?: string;
}

export interface SubmitDiagnosisDTO {
    summary: string;
    identifiedIssues?: string[];
}

export interface SubmitRepairEstimateDTO {
    items: IEstimateItem[];
    laborCost: number;
    partsCost: number;
    otherCharges?: number;
    totalAmount: number;
    estimatedRepairTime?: string;
    warranty?: string;
    notes?: string;
    updatedIssues?: string[];
}

export interface CustomerEstimateDecisionDTO {
    action: 'APPROVE' | 'DECLINE';
    reason?: string;
}

export interface CompleteRepairDTO {
    notes?: string;
    workProofPhotos?: IWorkProofPhoto[];
}

export interface ProcessPaymentDTO {
    paymentMethod?: string;
}

export interface SubmitReviewDTO {
    rating: number;
    comment?: string;
}
