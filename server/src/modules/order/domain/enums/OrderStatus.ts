export enum OrderStatus {
    PENDING = 'pending',
    SCHEDULED = 'scheduled',
    DEVICE_RECEIVED = 'device_received',
    DIAGNOSIS_IN_PROGRESS = 'diagnosis_in_progress',
    ESTIMATE_PENDING_APPROVAL = 'estimate_pending_approval',
    ESTIMATE_REJECTED = 'estimate_rejected',
    REPAIR_IN_PROGRESS = 'repair_in_progress',
    WAITING_FOR_PAYMENT = 'waiting_for_payment',
    COMPLETED = 'completed',
    CLOSED_WITHOUT_REPAIR = 'closed_without_repair',
    CANCELLED = 'cancelled'
}
