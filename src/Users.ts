import { Fetcher } from "./Fetcher";
import { UserDTO, createUpdateUserDTO, ResponseWrapper, ErrorType, hydrateDates, AllUsersDTO, API_URL } from "./types";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export default class UsersAPI {
  private static readonly BASE_PATH = `${API_URL}/users`;

  public static async getAllUsers(skip: number | null = null, take: number | null = null): Promise<ResponseWrapper<AllUsersDTO>> {
    let url = UsersAPI.BASE_PATH;
    const queryParams = new URLSearchParams();

    if (skip !== null) queryParams.append("skip", skip.toString());
    if (take !== null) queryParams.append("take", take.toString());

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const result = await Fetcher<AllUsersDTO>(url);

    if (!result.error && result.data) {

      console.log(result.data)
      return {
        data: {
          users: result.data.users.map((user) => hydrateDates(user)),
          totalCount: result.data.totalCount,
        },
      };
    }

    return { error: result.error };
  }

  public static async getUser(id: number): Promise<ResponseWrapper<UserDTO>> {
    const result = await Fetcher<UserDTO>(`${this.BASE_PATH}/${id}`);

    if (!result.error) return { data: hydrateDates(result.data!) };

    return result;
  }

  public static async createUser(userData: createUpdateUserDTO): Promise<ResponseWrapper<UserDTO>> {
    const result = await Fetcher<UserDTO>(this.BASE_PATH, {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (!result.error) return { data: hydrateDates(result.data!) };

    return result;
  }

  public static async updateUser(id: number, userData: createUpdateUserDTO): Promise<ResponseWrapper<UserDTO>> {
    const result = await Fetcher<UserDTO>(`${this.BASE_PATH}/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    if (!result.error) return { data: hydrateDates(result.data!) };

    return result;
  }

  public static async deleteUser(id: number): Promise<ResponseWrapper<void>> {
    const result = await Fetcher<void>(`${this.BASE_PATH}/${id}`, {
      method: "DELETE",
    });

    if (!result.error) return { data: undefined };

    return result;
  }
}
