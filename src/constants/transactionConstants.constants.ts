
enum TransactionType {
    CREDIT = 'credit',
    DEBIT = 'debit'
}

enum TransactionStatus {
    COMPLETED = 'completed',
    PENDING = 'pending',
    CANCELLED = 'cancelled'
}

export default {
    TransactionType,
    TransactionStatus,
}