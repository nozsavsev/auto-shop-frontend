export function hydrateDates(data: any) {
  return {
    ...data,
    createdAt: data.createdAt ? new Date(data.createdAt) : null,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
  };
}

export type CarDTO = {
  id: number;
  company: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
  users: UserBasicDTO[];
};

export type AllCarsDTO = {
  Cars: CarDTO[];
  TotalCount: number;
};

export type CarBasicDTO = {
  id: number;
  company: string;
  model: string;
};

export type createUpdateCarDTO = {
  company: string;
  model: string;
};

export type UserDTO = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  car: CarBasicDTO;
};

export type AllUsersDTO = {
  users: UserDTO[];
  totalCount: number;
};

export type UserBasicDTO = {
  id: number;
  name: string;
  email: string;
};

export type createUpdateUserDTO = {
  name: string;
  email: string;
  password?: string | null;
  carId?: number | null;
};

export type ErrorType = "NOT_FOUND" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NETWORK_ERROR";
export type ResponseWrapper<T> = {
  data?: T;
  error?: ErrorType;
  total?: number;
};
