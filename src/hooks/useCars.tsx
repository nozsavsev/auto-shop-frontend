import { useEffect, useState } from "react";
import useSWR, { KeyedMutator } from "swr";
import { ResponseWrapper, API } from "../API";
import { AllCarsDTO, CarDTO, CreateUpdateCarDTO, CarSortByNullable } from "../API/AutoShopApi";

export type useCarsParams = {
  initialPage: number;
  initialPageSize: number;
  textMatch: string | undefined;
  initialData: ResponseWrapper<AllCarsDTO> | undefined;
  initialSortBy?: CarSortByNullable | undefined;
};

export type useCarsType = {
  cars: CarDTO[];
  isLoading: boolean;
  error: Error | "NOT_FOUND" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NETWORK_ERROR" | undefined | null;
  apiError: Error | "NOT_FOUND" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NETWORK_ERROR" | undefined | null;
  refresh: KeyedMutator<ResponseWrapper<AllCarsDTO>>;
  updateCar: (carId: number, updatedCar: CreateUpdateCarDTO) => Promise<ResponseWrapper<CarDTO>>;
  deleteCar: (carId: number) => Promise<ResponseWrapper<void>>;
  sorting: {
    sortBy: CarSortByNullable | undefined;
    setSortBy: (value: CarSortByNullable | undefined) => void;
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
  };
};

export function useCars({ initialPage, initialPageSize, textMatch, initialData, initialSortBy }: useCarsParams): useCarsType {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState<CarSortByNullable | undefined>(initialSortBy);

  const { data, error, isLoading, mutate } = useSWR<ResponseWrapper<AllCarsDTO>>(
    [page, pageSize, textMatch, (initialData as any), sortBy],
    async () =>
      await API.Client.Cars.SearchCars({
        skip: page * pageSize,
        take: pageSize,
        textMatch: textMatch,
        sortBy: sortBy,
      }),
    {
      fallbackData: initialData,
      revalidateOnMount: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 1000 * 5,
      refreshInterval: 0,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    mutate();
  }, [textMatch, sortBy]);

  const updateCar = async (carId: number, updatedCar: CreateUpdateCarDTO) => {
    const response = await API.Client.Cars.UpdateCar({ id: carId, createUpdateCarDTO: updatedCar });
    if (!response.error && response.data) {
      await mutate(
        (currentData) => {
          if (!currentData?.data?.cars) return currentData;
          const updatedCars = currentData.data.cars.map((car) => (car.id === carId ? (response.data as CarDTO) : car));
          return {
            ...currentData,
            data: {
              ...currentData.data,
              cars: updatedCars,
            },
          };
        },
        { revalidate: false }
      );
    }
    return response;
  };

  const deleteCar = async (carId: number):Promise<ResponseWrapper<void>> => {
    const response = await API.Client.Cars.DeleteCar({ id: carId });
    if (!response.error) {
      await mutate(
        (currentData) => {
          if (!currentData?.data?.cars) return currentData;
          const updatedCars = currentData.data.cars.filter((car) => car.id !== carId);
          return {
            ...currentData,
            data: {
              ...currentData.data,
              cars: updatedCars,
              totalCount: (currentData.data.totalCount ?? 1) - 1,
            },
          };
        },
        { revalidate: true }
      );
    }
    return response;
  };

  const totalCount = data?.data?.totalCount ?? 0;
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0;

  return {
    cars: data?.data?.cars ?? [],
    isLoading,
    error: error || data?.error,
    apiError: data?.error,
    refresh: mutate,
    updateCar,
    deleteCar,
    sorting: {
      sortBy,
      setSortBy,
    },
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalItems: totalCount,
      totalPages: totalPages,
      hasNextPage: page < totalPages - 1,
      hasPrevPage: page > 0,
      setPage: setPage,
      setPageSize: setPageSize,
    },
  };
}
