import { AiOutlineLoading } from "react-icons/ai";
import { IoBanOutline, IoRefreshOutline } from "react-icons/io5";
import { Id, toast } from "react-toastify";
import CarRow from "../components/cars/CarRow";
import FillWithCarsButton from "../components/cars/FillWithCarsButton";
import CreateCarButton from "../components/cars/CreateCarButton";
import Pagination from "@/components/Pagination";
import { AllCarsDTO, CreateUpdateCarDTO } from "@/src/API/AutoShopApi";
import { useCars } from "@/src/hooks/useCars";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API, ResponseWrapper } from "@/src/API";
import { GetServerSidePropsContext } from "next";
import { FaCar } from "react-icons/fa";
import { FaCross } from "react-icons/fa6";
import { RxCross1, RxCross2 } from "react-icons/rx";
import { SearchBar } from "@/components/SearchBar";
import { FullTableMessage } from "@/components/FullTableMessage";

type CarsPageProps = {
  initialSearch: string;
  initialPage: number;
  initialPageSize: number;
  initialCars: ResponseWrapper<AllCarsDTO>;
};

type CarsPageQuery = {
  q?: string;
  s?: number;
  t?: number;
};

export default function Cars({ initialSearch, initialPage, initialPageSize, initialCars }: CarsPageProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const { cars, isLoading, error, refresh, updateCar, deleteCar, pagination } = useCars({
    initialPage,
    initialPageSize,
    textMatch: search,
    initialData: initialCars,
  });

  const { currentPage, pageSize } = pagination;

  useEffect(() => {
    if (router.isReady) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            q: search || undefined,
            s: currentPage || undefined,
            t: pageSize || undefined,
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [search, currentPage, pageSize, router.isReady]);

  return (
    <div className="flex flex-col w-full p-6 h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-4 mb-6 w-full">
        <h1
          onClick={() => {
            pagination.setPage(0);
            pagination.setPageSize(10);
            setSearch("");
          }}
          className="text-2xl w-fit font-bold flex items-center gap-2 cursor-pointer"
        >
          <FaCar className="text-2xl" />
          Manage cars
        </h1>
        <div className="flex flex-wrap justify-between w-full gap-2">
          <div className="flex gap-2">
            <CreateCarButton onSuccess={refresh} />
            <FillWithCarsButton refresh={refresh} />
          </div>
          <SearchBar search={search} setSearch={setSearch} />
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg">
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
                <FullTableMessage>
                  <p className="text-red-500 font-bold w-full flex items-center justify-center text-4xl">
                    {typeof error === "string" ? error : "An error occurred"}
                  </p>
                </FullTableMessage>
              )}
              {cars?.length === 0 && !isLoading && !error && (
                <FullTableMessage>
                  <IoBanOutline className="text-4xl text-neutral-500" />
                  <p className="text-neutral-800 font-semibold text-lg mt-2">No cars found</p>
                </FullTableMessage>
              )}
              {cars?.map((car) => (
                <CarRow
                  key={car.id}
                  car={car}
                  textMatch={search}
                  updateCar={async (newCar: CreateUpdateCarDTO | null, toastId: Id | null) => {
                    if (newCar) {
                      const result = await updateCar(car.id ?? 0, newCar);
                      if (result.error) {
                        toastId && toast.update(toastId, { render: "Failed to update car", type: "error", isLoading: false, autoClose: 5000 });
                      } else {
                        toastId && toast.update(toastId, { render: "Car updated", type: "success", isLoading: false, autoClose: 5000 });
                      }
                    } else {
                      const result = await deleteCar(car.id ?? 0);
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
        </div>

        <div className="relative bottom-16 flex items-center justify-center h-0">
        <div className="flex items-center justify-center">
            <Pagination pagination={pagination} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { q, s, t } = ctx.query;
  const initialPage = s ? parseInt(s as string) : 0;
  const initialPageSize = t ? parseInt(t as string) : 10;
  const initialSearch = (q as string) || "";

  const cars = await API.SSR.Cars.SearchCars({
    skip: initialPage * initialPageSize,
    take: initialPageSize,
    textMatch: initialSearch,
  });

  console.log({ initialSearch, initialPage, initialPageSize, initialCars: cars });

  return {
    props: {
      initialSearch,
      initialPage,
      initialPageSize,
      initialCars: cars,
    },
  };
}
