export type UserRole = "Admin" | "Editor" | "Viewer";

export type UserStatus = "Active" | "Inactive" | "Suspended";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  image: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  lastActive: string;
}

export interface UsersResult {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface UserDetails extends AdminUser {
  phone: string;
  birthDate: string;
  address: string;
  twoFactorEnabled: boolean;
}

export type TransactionType = "Payment" | "Refund" | "Transfer";

export type TransactionStatus = "Completed" | "Pending" | "Failed" | "Refunded";

export interface Transaction {
  id: number;
  transactionId: string;
  userId: number;
  customerName: string;
  customerImage: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
}

export interface TransactionsResult {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionDetails extends Transaction {
  paymentMethod: string;
  referenceId: string;
  processingFee: number;
  subtotal: number;
}
export type BookingStatus = "Confirmed" | "Completed" | "Pending" | "Cancelled";

export interface Booking {
  id: number;
  bookingId: string;
  customerId: number;
  customerName: string;
  customerImage: string;
  service: string;
  date: string;
  duration: string;
  status: BookingStatus;
  amount: number;
}

export interface BookingsResult {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
}

export interface BookingDetails extends Booking {
  customerEmail: string;
  customerPhone: string;
  location: string;
  notes: string;
  paymentStatus: "Paid";
  invoiceId: string;
  previousBookings: number;
}
