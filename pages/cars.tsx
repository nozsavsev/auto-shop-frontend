import { AiOutlineLoading } from "react-icons/ai";
import { IoBanOutline, IoRefreshOutline } from "react-icons/io5";
import { Id, toast } from "react-toastify";
import ModernCarRow from "../components/cars/ModernCarRow";
import FillWithCarsButton from "../components/cars/FillWithCarsButton";
import CreateCarButton from "../components/cars/CreateCarButton";
import Pagination from "@/components/Pagination";
import { AllCarsDTO, CreateUpdateCarDTO, CarSortByNullable } from "@/src/API/AutoShopApi";
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
import { useSelection } from "@/src/hooks/useSelection";
import BatchActions from "@/components/BatchActions";
import SortableHeader, { SortDirection } from "@/components/SortableHeader";

type CarsPageProps = {
  initialSearch: string;
  initialPage: number;
  initialPageSize: number;
  initialCars: ResponseWrapper<AllCarsDTO>;
  initialSortBy?: CarSortByNullable;
};

type CarsPageQuery = {
  q?: string;
  s?: number;
  t?: number;
};

export default function Cars({ initialSearch, initialPage, initialPageSize, initialCars, initialSortBy }: CarsPageProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const { cars, isLoading, error, refresh, updateCar, deleteCar, pagination, sorting } = useCars({
    initialPage,
    initialPageSize,
    textMatch: search,
    initialData: initialCars,
    initialSortBy: initialSortBy,
  });

  // Map UI sort to API enum
  const applySort = (key: string | null, dir: SortDirection) => {
    let apiSort: CarSortByNullable | undefined = undefined;
    if (key && dir) {
      switch (key) {
        case 'company':
          apiSort = dir === 'asc' ? CarSortByNullable.CompanyAsc : CarSortByNullable.CompanyDesc;
          break;
        case 'createdAt':
          apiSort = dir === 'asc' ? CarSortByNullable.CreatedAtAsc : CarSortByNullable.CreatedAtDesc;
          break;
        case 'updatedAt':
          apiSort = dir === 'asc' ? CarSortByNullable.UpdatedAtAsc : CarSortByNullable.UpdatedAtDesc;
          break;
        default:
          apiSort = undefined;
      }
    }
    sorting.setSortBy(apiSort);
  };

  const selection = useSelection({
    allItems: cars || [],
    currentPageItems: cars || [],
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
            o: sorting.sortBy || undefined,
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [search, currentPage, pageSize, sorting.sortBy, router.isReady]);

  const handleSort = (key: string, direction: SortDirection) => {
    setSortKey(key);
    setSortDirection(direction);
    applySort(key, direction);
  };

  const handleBatchDelete = async () => {
    const selectedItems = selection.getSelectedItems();
    const deletePromises = selectedItems.map(car =>
      deleteCar(car.id ?? 0)
    );

    await Promise.all(deletePromises);
    selection.clearSelection();
    refresh();
  };

  return (
    <div className="flex flex-col w-full p-6 h-[calc(100vh-4rem)]">
      <div className="flex flex-col gap-4 mb-6 w-full">
        <h1
          onClick={() => {
            pagination.setPage(0);
            pagination.setPageSize(10);
            setSearch("");
            selection.clearSelection();
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
            <thead className="bg-white sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="w-12 px-4 py-3 bg-white">
                  <input
                    type="checkbox"
                    checked={selection.isAllSelected()}
                    ref={(el) => {
                      if (el) el.indeterminate = selection.isIndeterminate();
                    }}
                    onChange={selection.toggleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </th>
                <SortableHeader
                  label="Car"
                  sortKey="company"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <th className="font-semibold px-4 py-3 bg-white text-left select-none">Users</th>
                <SortableHeader
                  label="Last active"
                  sortKey="updatedAt"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Date added"
                  sortKey="createdAt"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <th className="w-12 px-4 py-3 bg-white"></th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <FullTableMessage>
                  <p className="text-red-500 font-bold w-full flex items-center justify-center text-4xl">
                    {typeof error === "string" ? error : "An error occurred"}
                  </p>
                </FullTableMessage>
              )}
              {(cars?.length || 0) === 0 && !isLoading && !error && (
                <FullTableMessage>
                  <IoBanOutline className="text-4xl text-neutral-500" />
                  <p className="text-neutral-800 font-semibold text-lg mt-2">No cars found</p>
                </FullTableMessage>
              )}
              {cars?.map((car) => (
                <ModernCarRow
                  key={car.id}
                  car={car}
                  textMatch={search}
                  isSelected={selection.isSelected(car.id ?? 0)}
                  onSelectionChange={selection.handleSelection}
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
                        selection.clearSelection();
                      }
                    }
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className={`${selection.getSelectedCount() === 0 ? "h-12 sm:h-10" : "h-20 sm:h-16"}`} />
        <div className={`sticky ${selection.getSelectedCount() === 0 ? "bottom-16" : "bottom-24"} flex items-center justify-center h-0 z-50`}>
          <div className="flex flex-col items-center gap-2 justify-center">
            <BatchActions
              selectedCount={selection.getSelectedCount()}
              hiddenSelectedCount={selection.getHiddenSelectedCount()}
              onBatchDelete={handleBatchDelete}
              onClearSelection={selection.clearSelection}
              itemType="car"
            />
            <Pagination pagination={pagination} />
          </div>
        </div>
        <div className={`${selection.getSelectedCount() === 0 ? "h-6 sm:h-6" : "h-14 sm:h-12"}`} />

      </div>


    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { q, s, t, o } = ctx.query;
  const initialPage = s ? parseInt(s as string) : 0;
  const initialPageSize = t ? parseInt(t as string) : 10;
  const initialSearch = (q as string) || "";

  const cars = await API.SSR.Cars.SearchCars({
    skip: initialPage * initialPageSize,
    take: initialPageSize,
    textMatch: initialSearch,
    sortBy: (o as CarSortByNullable) || undefined,
  });

  console.log({ initialSearch, initialPage, initialPageSize, initialCars: cars });

  return {
    props: {
      initialSearch,
      initialPage,
      initialPageSize,
      initialCars: cars,
      initialSortBy: ((o as CarSortByNullable) || null) ?? null,
    },
  };
}
