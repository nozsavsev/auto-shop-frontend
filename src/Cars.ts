import { Fetcher } from "./Fetcher";
import { CarDTO, createUpdateCarDTO, ErrorType, hydrateDates, ResponseWrapper } from "./types";

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
  private static readonly BASE_PATH = `${process.env.NEXT_PUBLIC_API_URL}/cars`;

  public static async getAllCars(skip: number | null = null, take: number | null = null): Promise<ResponseWrapper<AllCarsDTO>> {
    let url = CarsAPI.BASE_PATH;
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
    const result = await Fetcher<CarDTO>(`${this.BASE_PATH}/${id}`);
    if (!result.error) return { data: hydrateDates(result.data!) };
    return result;
  }

  public static async createCar(carData: createUpdateCarDTO): Promise<ResponseWrapper<CarDTO>> {
    const result = await Fetcher<CarDTO>(this.BASE_PATH, {
      method: 'POST',
      body: JSON.stringify(carData),
    });
    if (!result.error) return { data: hydrateDates(result.data!) };
    return result;
  }

  public static async updateCar(id: number, carData: createUpdateCarDTO): Promise<ResponseWrapper<CarDTO>> {
    const result = await Fetcher<CarDTO>(`${this.BASE_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
    if (!result.error) return { data: hydrateDates(result.data!) };
    return result;
  }

  public static async deleteCar(id: number): Promise<ResponseWrapper<void>> {
    const result = await Fetcher<void>(`${this.BASE_PATH}/${id}`, {
      method: 'DELETE',
    });
    if (!result.error) return { data: undefined };
    return result;
  }
}
