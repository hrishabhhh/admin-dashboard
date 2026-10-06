import type {
  AdminUser,
  Booking,
  BookingDetails,
  BookingStatus,
  BookingsResult,
  Transaction,
  TransactionDetails,
  TransactionStatus,
  TransactionType,
  TransactionsResult,
  UserDetails,
  UserRole,
  UserStatus,
  UsersResult,
} from "@/types";

const API_URL = "https://dummyjson.com";

type DummyCart = {
  id: number;
  userId: number;
  total: number;
  discountedTotal: number;
};

type DummyCartsResponse = {
  carts: DummyCart[];
  total: number;
  skip: number;
  limit: number;
};

type DummyUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  phone: string;
  birthDate: string;
  address: {
    address: string;
    city: string;
    state: string;
  };
};
type DummyUsersResponse = {
  users: DummyUser[];
  total: number;
  skip: number;
  limit: number;
};

function getRole(id: number): UserRole {
  const roles: UserRole[] = ["Admin", "Editor", "Viewer"];

  return roles[(id - 1) % roles.length];
}

function getStatus(id: number): UserStatus {
  if (id % 7 === 0) {
    return "Suspended";
  }

  if (id % 3 === 0) {
    return "Inactive";
  }

  return "Active";
}

function getJoinedDate(id: number) {
  const date = new Date(2024, 0, 1);

  date.setDate(date.getDate() + id * 11);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getLastActive(id: number) {
  const values = [
    "2 mins ago",
    "1 hour ago",
    "3 days ago",
    "Just now",
    "1 week ago",
    "5 mins ago",
    "10 mins ago",
    "4 days ago",
  ];

  return values[(id - 1) % values.length];
}

function mapUser(user: DummyUser): AdminUser {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    image: user.image,
    role: getRole(user.id),
    status: getStatus(user.id),
    joinedDate: getJoinedDate(user.id),
    lastActive: getLastActive(user.id),
  };
}

type GetUsersParams = {
  page: number;
  limit?: number;
  search?: string;
};

export async function getUsers({
  page,
  limit = 8,
  search = "",
}: GetUsersParams): Promise<UsersResult> {
  const skip = (page - 1) * limit;

  const params = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });

  let endpoint = `${API_URL}/users`;

  if (search.trim()) {
    endpoint = `${API_URL}/users/search`;

    params.set("q", search.trim());
  }

  const response = await fetch(`${endpoint}?${params}`);

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  const data: DummyUsersResponse = await response.json();

  return {
    users: data.users.map(mapUser),
    total: data.total,
    page,
    limit,
  };
}

export async function getUser(id: number): Promise<UserDetails> {
  const response = await fetch(`${API_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load user");
  }

  const user: DummyUser = await response.json();

  const mappedUser = mapUser(user);

  return {
    ...mappedUser,
    phone: user.phone,
    birthDate: new Date(user.birthDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    address: [user.address.address, user.address.city, user.address.state]
      .filter(Boolean)
      .join(", "),
    twoFactorEnabled: user.id % 2 !== 0,
  };
}

function getTransactionType(id: number): TransactionType {
  if (id % 5 === 0) {
    return "Refund";
  }

  if (id % 4 === 0) {
    return "Transfer";
  }

  return "Payment";
}

function getTransactionStatus(id: number): TransactionStatus {
  if (id % 7 === 0) {
    return "Failed";
  }

  if (id % 5 === 0) {
    return "Refunded";
  }

  if (id % 3 === 0) {
    return "Pending";
  }

  return "Completed";
}

function getTransactionDate(id: number) {
  const date = new Date(2024, 9, 1);

  date.setDate(date.getDate() - (id - 1));

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const hour = 8 + ((id * 3) % 9);
  const minute = (id * 7) % 60;

  return `${datePart} ${String(hour).padStart(
    2,
    "0",
  )}:${String(minute).padStart(2, "0")}`;
}

export async function getTransactions({
  page,
  limit = 8,
}: {
  page: number;
  limit?: number;
}): Promise<TransactionsResult> {
  const skip = (page - 1) * limit;

  const [cartsResponse, usersResponse] = await Promise.all([
    fetch(`${API_URL}/carts?limit=${limit}&skip=${skip}`),
    fetch(`${API_URL}/users?limit=100`),
  ]);

  if (!cartsResponse.ok || !usersResponse.ok) {
    throw new Error("Failed to load transactions");
  }

  const cartsData: DummyCartsResponse = await cartsResponse.json();

  const usersData: DummyUsersResponse = await usersResponse.json();

  const usersMap = new Map(usersData.users.map((user) => [user.id, user]));

  const transactions: Transaction[] = cartsData.carts.map((cart) => {
    const user = usersMap.get(cart.userId);

    const type = getTransactionType(cart.id);

    const status = getTransactionStatus(cart.id);

    const amount =
      type === "Refund" ? -cart.discountedTotal : cart.discountedTotal;

    return {
      id: cart.id,
      transactionId: `TXN-${String(1083 - cart.id)}`,
      userId: cart.userId,
      customerName: user
        ? `${user.firstName} ${user.lastName}`
        : "Unknown User",
      customerImage: user?.image ?? "",
      type,
      amount,
      status,
      date: getTransactionDate(cart.id),
    };
  });

  return {
    transactions,
    total: cartsData.total,
    page,
    limit,
  };
}

export async function getTransaction(id: number): Promise<TransactionDetails> {
  const cartResponse = await fetch(`${API_URL}/carts/${id}`);

  if (!cartResponse.ok) {
    throw new Error("Failed to load transaction");
  }

  const cart: DummyCart = await cartResponse.json();

  const userResponse = await fetch(`${API_URL}/users/${cart.userId}`);

  if (!userResponse.ok) {
    throw new Error("Failed to load transaction user");
  }

  const user: DummyUser = await userResponse.json();

  const type = getTransactionType(cart.id);
  const status = getTransactionStatus(cart.id);

  const amount =
    type === "Refund" ? -cart.discountedTotal : cart.discountedTotal;

  const processingFee = Math.round(Math.abs(amount) * 0.032 * 100) / 100;

  const subtotal = Math.round((Math.abs(amount) - processingFee) * 100) / 100;

  return {
    id: cart.id,
    transactionId: `TXN-${1083 - cart.id}`,
    userId: cart.userId,
    customerName: `${user.firstName} ${user.lastName}`,
    customerImage: user.image,
    type,
    amount,
    status,
    date: getTransactionDate(cart.id),

    paymentMethod:
      cart.id % 2 === 0
        ? "Credit Card (Visa ending in 4582)"
        : "Corporate Mastercard (**** 7821)",

    referenceId: `REF-${98342718 + cart.id}`,

    processingFee,
    subtotal,
  };
}

const bookingServices = [
  "Business Consultation",
  "Technical Support",
  "Executive Coaching",
  "Strategy Session",
  "Personal Training",
  "Security Assessment",
  "IT Consultation",
  "Platform Audit",
  "Database Migration",
];

const bookingAmounts = [180, 120, 250, 180, 95, 600, 250, 420, 1100];

const bookingDurations = [
  "1.5 hrs",
  "1.0 hr",
  "2.0 hrs",
  "1.5 hrs",
  "1.0 hr",
  "1.5 hrs",
  "1.0 hr",
  "2.0 hrs",
];

function getBookingStatus(id: number): BookingStatus {
  if (id % 7 === 0) {
    return "Cancelled";
  }

  if (id % 4 === 0) {
    return "Pending";
  }

  if (id % 3 === 0) {
    return "Completed";
  }

  return "Confirmed";
}

function getBookingDate(id: number) {
  const date = new Date(2024, 9, 15);

  date.setDate(date.getDate() - (id - 1));

  const hour = 9 + ((id * 2) % 8);
  const minute = id % 2 === 0 ? "30" : "00";

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return `${datePart} ${String(hour).padStart(2, "0")}:${minute}`;
}

function mapBooking(user: DummyUser): Booking {
  const serviceIndex = (user.id - 1) % bookingServices.length;

  const durationIndex = (user.id - 1) % bookingDurations.length;

  return {
    id: user.id,
    bookingId: `BKG-${2342 - user.id}`,
    customerId: user.id,
    customerName: `${user.firstName} ${user.lastName}`,
    customerImage: user.image,
    service: bookingServices[serviceIndex],
    date: getBookingDate(user.id),
    duration: bookingDurations[durationIndex],
    status: getBookingStatus(user.id),
    amount: bookingAmounts[serviceIndex],
  };
}

export async function getBookings({
  page,
  limit = 8,
}: {
  page: number;
  limit?: number;
}): Promise<BookingsResult> {
  const skip = (page - 1) * limit;

  const response = await fetch(`${API_URL}/users?limit=${limit}&skip=${skip}`);

  if (!response.ok) {
    throw new Error("Failed to load bookings");
  }

  const data: DummyUsersResponse = await response.json();

  const bookings: Booking[] = data.users.map(mapBooking);

  return {
    bookings,
    total: data.total,
    page,
    limit,
  };
}

export async function getBooking(id: number): Promise<BookingDetails> {
  const response = await fetch(`${API_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load booking");
  }

  const user: DummyUser = await response.json();

  const booking = mapBooking(user);

  return {
    ...booking,

    customerEmail: user.email,

    customerPhone: user.phone,

    location: "Virtual (Zoom link enclosed)",

    notes:
      "Please prepare relevant project details and requirements before the session.",

    paymentStatus: "Paid",

    invoiceId: `INV-${20418 + id}`,

    previousBookings: 8 + (id % 7),
  };
}
