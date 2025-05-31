import { Fetcher } from "./Fetcher";
import { CarDTO, createUpdateCarDTO, ErrorType, hydrateDates, ResponseWrapper, getApiUrl } from "./types";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export type AllCarsDTO = {
  cars: CarDTO[];
  totalCount: number;
};

export default class CarsAPI {
  private static async getBasePath() {
    const apiUrl = await getApiUrl();
    return `${apiUrl}/cars`;
  }

  public static async getAllCars(skip: number | null = null, take: number | null = null): Promise<ResponseWrapper<AllCarsDTO>> {
    let url = await CarsAPI.getBasePath();
    const queryParams = new URLSearchParams();
    if (skip !== null) queryParams.append("skip", skip.toString());
    if (take !== null) queryParams.append("take", take.toString());
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    const result = await Fetcher<AllCarsDTO>(url);
    if (!result.error && result.data) {
      return {
        data: {
          cars: result.data.cars.map((car) => hydrateDates(car)),
          totalCount: result.data.totalCount,
        },
      };
    }
    return { error: result.error };
  }

  public static async getCar(id: number): Promise<ResponseWrapper<CarDTO>> {
    const result = await Fetcher<CarDTO>(`${await this.getBasePath()}/${id}`);
    if (!result.error) return { data: hydrateDates(result.data!) };
    return result;
  }

  public static async createCar(carData: createUpdateCarDTO): Promise<ResponseWrapper<CarDTO>> {
    const result = await Fetcher<CarDTO>(await this.getBasePath(), {
      method: 'POST',
      body: JSON.stringify(carData),
    });
    if (!result.error) return { data: hydrateDates(result.data!) };
    return result;
  }

  public static async updateCar(id: number, carData: createUpdateCarDTO): Promise<ResponseWrapper<CarDTO>> {
    const result = await Fetcher<CarDTO>(`${await this.getBasePath()}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
    if (!result.error) return { data: hydrateDates(result.data!) };
    return result;
  }

  public static async deleteCar(id: number): Promise<ResponseWrapper<void>> {
    const result = await Fetcher<void>(`${await this.getBasePath()}/${id}`, {
      method: 'DELETE',
    });
    if (!result.error) return { data: undefined };
    return result;
  }
}
