import { AiOutlineLoading } from "react-icons/ai";
import { IoBanOutline, IoRefreshOutline } from "react-icons/io5";
import { Id, toast } from "react-toastify";
import ModernCarRow from "../components/cars/ModernCarRow";
import FillWithCarsButton from "../components/cars/FillWithCarsButton";
import CreateCarButton from "../components/cars/CreateCarButton";
import Pagination from "@/components/Pagination";
import { AllCarsDTO, CreateUpdateCarDTO } from "@/src/API/AutoShopApi";
import { useCars } from "@/src/hooks/useCars";
import { useEffect, useState, useMemo } from "react";
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
};

type CarsPageQuery = {
  q?: string;
  s?: number;
  t?: number;
};

export default function Cars({ initialSearch, initialPage, initialPageSize, initialCars }: CarsPageProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  const { cars, isLoading, error, refresh, updateCar, deleteCar, pagination } = useCars({
    initialPage,
    initialPageSize,
    textMatch: search,
    initialData: initialCars,
  });

  // Sort cars based on current sort settings
  const sortedCars = useMemo(() => {
    if (!sortKey || !sortDirection || !cars) return cars || [];
    
    return [...cars].sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';
      
      switch (sortKey) {
        case 'company':
          aVal = a.company?.toLowerCase() || '';
          bVal = b.company?.toLowerCase() || '';
          break;
        case 'model':
          aVal = a.model?.toLowerCase() || '';
          bVal = b.model?.toLowerCase() || '';
          break;
        case 'users':
          aVal = a.users?.length || 0;
          bVal = b.users?.length || 0;
          break;
        case 'createdAt':
          aVal = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          bVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          break;
        case 'updatedAt':
          aVal = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
          bVal = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
          break;
        default:
          return 0;
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [cars, sortKey, sortDirection]);

  const selection = useSelection({
    allItems: cars || [],
    currentPageItems: sortedCars
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

  const handleSort = (key: string, direction: SortDirection) => {
    setSortKey(key);
    setSortDirection(direction);
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
                <SortableHeader
                  label="Users"
                  sortKey="users"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
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
              {sortedCars?.length === 0 && !isLoading && !error && (
                <FullTableMessage>
                  <IoBanOutline className="text-4xl text-neutral-500" />
                  <p className="text-neutral-800 font-semibold text-lg mt-2">No cars found</p>
                </FullTableMessage>
              )}
              {sortedCars?.map((car) => (
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

        <div className="relative bottom-16 flex items-center justify-center h-0">
        <div className="flex items-center justify-center">
            <Pagination pagination={pagination} />
          </div>
        </div>
      </div>

      <BatchActions
        selectedCount={selection.getSelectedCount()}
        visibleSelectedCount={selection.getVisibleSelectedCount()}
        hiddenSelectedCount={selection.getHiddenSelectedCount()}
        onBatchDelete={handleBatchDelete}
        onClearSelection={selection.clearSelection}
        itemType="car"
      />
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
