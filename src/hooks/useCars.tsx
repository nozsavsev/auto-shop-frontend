import { useEffect, useState } from "react";
import useSWR from "swr";
import { ResponseWrapper, API } from "../API";
import { AllCarsDTO, CarDTO, CreateUpdateCarDTO } from "../API/AutoShopApi";

export function useCars(initialPage: number = 0, initialPageSize: number = 10, textMatch: string | undefined = undefined, initialData: ResponseWrapper<AllCarsDTO> | undefined = undefined){
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

    const { data, error, isLoading, mutate } = useSWR<ResponseWrapper<AllCarsDTO>>(
    [page, pageSize, textMatch],
    async () => await API.Client.Cars.SearchCars({ skip: page * pageSize, take: pageSize, textMatch: textMatch }),
    {
      fallbackData: initialData,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 1000 * 5,
      refreshInterval: 0,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    mutate();
  }, [textMatch]);

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

  const deleteCar = async (carId: number) => {
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

  // Calculate pagination values, using initial data if available
  const totalCount = data?.data?.totalCount ?? initialData?.data?.totalCount ?? 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;
  const hasNextPage = page < totalPages - 1;
  const hasPrevPage = page > 0;

  return {
    cars: data?.data?.cars ?? initialData?.data?.cars ?? [],
    isLoading,
    error: error || data?.error,
    apiError: data?.error,
    refresh: mutate,
    updateCar,
    deleteCar,
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalCount: totalCount,
      totalPages: totalPages,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
      setPage: setPage,
      setPageSize: setPageSize,
    },
  };
}
