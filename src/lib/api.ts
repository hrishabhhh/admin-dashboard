import type {
  AdminUser,
  UserDetails,
  UserRole,
  UserStatus,
  UsersResult,
} from "@/types";
const API_URL = "https://dummyjson.com";

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
