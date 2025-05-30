import { useState } from "react";
import useSWR from "swr";
import CarsAPI from "@/src/Cars";
import { CarDTO, createUpdateCarDTO, ResponseWrapper } from "@/src/types";
import { AiOutlineLoading } from "react-icons/ai";
import { IoBanOutline, IoRefreshOutline } from "react-icons/io5";
import { Id, toast } from "react-toastify";
import CarRow from "../components/cars/CarRow";
import Pagination from "../components/cars/Pagination";
import FillWithCarsButton from "../components/cars/FillWithCarsButton";
import CreateCarButton from "../components/cars/CreateCarButton";

export default function Cars() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data, error, isLoading, mutate } = useSWR<ResponseWrapper<{ cars: CarDTO[]; totalCount: number }>>(
    ["/api/cars", page, pageSize],
    () => CarsAPI.getAllCars(page * pageSize, pageSize),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 1000 * 5,
      refreshInterval: 0,
      keepPreviousData: true,
    }
  );

  const refresh = mutate;

  const updateCar = async (carId: number, updatedCar: createUpdateCarDTO) => {
    const response = await CarsAPI.updateCar(carId, updatedCar);
    if (!response.error && response.data) {
      await mutate(
        (currentData) => {
          if (!currentData?.data) return currentData;
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
    const response = await CarsAPI.deleteCar(carId);
    if (!response.error) {
      await mutate(
        (currentData) => {
          if (!currentData?.data) return currentData;
          const updatedCars = currentData.data.cars.filter((car) => car.id !== carId);
          return {
            ...currentData,
            data: {
              ...currentData.data,
              cars: updatedCars,
              totalCount: currentData.data.totalCount - 1,
            },
          };
        },
        { revalidate: true }
      );
    }
    return response;
  };

  const pagination = {
    currentPage: page,
    pageSize: pageSize,
    totalPages: data?.data?.totalCount ? Math.ceil(data.data.totalCount / pageSize) : 0,
    hasNextPage: page < (data?.data?.totalCount ? Math.ceil(data.data.totalCount / pageSize) : 0) - 1,
    hasPrevPage: page > 0,
    setPage: setPage,
    setPageSize: setPageSize,
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden p-6 max-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Cars</h1>
        <div className="flex flex-wrap gap-2">
          <CreateCarButton onSuccess={refresh} />
          <FillWithCarsButton refresh={refresh} />
          <button
            className="bg-white text-black px-2 py-1 rounded-md flex items-center border border-gray-200 cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50 hover:border-gray-300"
            onClick={async () => {
              setIsRefreshing(true);
              await refresh();
              const minAnimationTime = 500;
              const startTime = Date.now();
              await refresh();
              const elapsedTime = Date.now() - startTime;
              const remainingTime = Math.max(0, minAnimationTime - elapsedTime);
              setTimeout(() => {
                setIsRefreshing(false);
              }, remainingTime);
            }}
          >
            <IoRefreshOutline
              className={`mr-2 transition-transform duration-300 ease-in-out ${isRefreshing ? "animate-[spin_1s_linear_infinite]" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1 min-h-0 relative">
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-white text-gray-500 uppercase text-xs sticky top-0 z-10">
              <tr className="divide-x divide-gray-200">
                <th className="font-semibold min-w-8 text-right bg-white" />
                <th className="font-semibold w-8 text-center bg-white">ID</th>
                <th className="font-semibold px-3 py-1.5 bg-white">Company</th>
                <th className="font-semibold px-3 py-1.5 bg-white">Model</th>
                <th className="font-semibold px-3 py-1.5 bg-white">Users</th>
                <th className="font-semibold px-3 py-1.5 bg-white">Created At</th>
                <th className="font-semibold px-3 py-1.5 bg-white">Updated At</th>
                <th className="font-semibold w-8 px-3 py-1.5 bg-white" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {error && (
                <tr>
                  <td colSpan={80} className="h-96">
                    <p className="text-red-500 font-bold w-full flex items-center justify-center text-4xl">{error}</p>
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td colSpan={80} className="h-96">
                    <div className="flex flex-col h-full flex-1 grow items-center justify-center">
                      <AiOutlineLoading className="text-4xl animate-spin text-black" />
                      <p className="mt-2 font-semibold text-lg text-gray-600">Loading cars...</p>
                    </div>
                  </td>
                </tr>
              )}
              {data?.data?.cars?.length === 0 && !isLoading && !error && (
                <tr>
                  <td colSpan={80} className="h-96">
                    <div className="flex flex-col h-full flex-1 grow items-center justify-center">
                      <IoBanOutline className="text-4xl text-neutral-500" />
                      <p className="text-neutral-800 font-semibold text-lg mt-2">No cars found</p>
                    </div>
                  </td>
                </tr>
              )}
              {data?.data?.cars?.map((car) => (
                <CarRow
                  key={car.id}
                  car={car}
                  updateCar={async (newCar: createUpdateCarDTO | null, toastId: Id | null) => {
                    if (newCar) {
                      const result = await updateCar(car.id, newCar);
                      if (result.error) {
                        toastId && toast.update(toastId, { render: "Failed to update car", type: "error", isLoading: false, autoClose: 5000 });
                      } else {
                        toastId && toast.update(toastId, { render: "Car updated", type: "success", isLoading: false, autoClose: 5000 });
                      }
                    } else {
                      const result = await deleteCar(car.id);
                      if (result.error) {
                        toastId && toast.update(toastId, { render: "Failed to delete car", type: "error", isLoading: false, autoClose: 5000 });
                      } else {
                        toastId && toast.update(toastId, { render: "Car deleted", type: "success", isLoading: false, autoClose: 5000 });
                      }
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} />
        </div>
      </div>
    </div>
  );
}
