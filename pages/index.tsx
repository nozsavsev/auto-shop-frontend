import { useUsers } from "@/src/hooks/useUsers";
import { useState, useEffect, useMemo } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoBanOutline, IoRefreshOutline } from "react-icons/io5";
import { Id, toast } from "react-toastify";
import CreateUserButton from "@/components/users/CreateUserButton";
import ModernUserRow from "../components/users/ModernUserRow";
import Pagination from "../components/Pagination";
import FillWithUsersButton from "../components/users/FillWithUsersButton";
import { AllCarsDTO, AllUsersDTO, CarDTO, CreateUpdateUserDTO } from "@/src/API/AutoShopApi";
import { API, ResponseWrapper } from "@/src/API";
import { FullTableMessage } from "@/components/FullTableMessage";
import { GetServerSidePropsContext } from "next";
import { FaUsers } from "react-icons/fa";
import { useRouter } from "next/router";
import { SearchBar } from "@/components/SearchBar";
import { useCars } from "@/src/hooks/useCars";
import { useSelection } from "@/src/hooks/useSelection";
import BatchActions from "@/components/BatchActions";
import SortableHeader, { SortDirection } from "@/components/SortableHeader";

type UsersPageProps = {
  initialSearch: string;
  initialPage: number;
  initialPageSize: number;
  initialUsers: ResponseWrapper<AllUsersDTO>;
  initialCars: ResponseWrapper<AllCarsDTO>;
  initialCarsPage: number;
  initialCarsPageSize: number;
  initialCarsSearch: string;
};

type CarsPageQuery = {
  q?: string;
  s?: number;
  t?: number;
  cq?: string;
  cs?: number;
  ct?: number;
};

export default function Users({
  initialSearch,
  initialPage,
  initialPageSize,
  initialUsers,
  initialCars,
  initialCarsPage,
  initialCarsPageSize,
  initialCarsSearch,
}: UsersPageProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  const { users, isLoading, error, refresh, pagination, updateUser, deleteUser } = useUsers(initialPage, initialPageSize, search, initialUsers);

  const [carsSearch, setCarsSearch] = useState(initialCarsSearch);

  const Cars = useCars({ initialPage: initialCarsPage, initialPageSize: initialCarsPageSize, textMatch: carsSearch, initialData: initialCars });

  // Sort users based on current sort settings
  const sortedUsers = useMemo(() => {
    if (!sortKey || !sortDirection) return users;
    
    return [...users].sort((a, b) => {
      let aVal: any = '';
      let bVal: any = '';
      
      switch (sortKey) {
        case 'name':
          aVal = a.name?.toLowerCase() || '';
          bVal = b.name?.toLowerCase() || '';
          break;
        case 'email':
          aVal = a.email?.toLowerCase() || '';
          bVal = b.email?.toLowerCase() || '';
          break;
        case 'car':
          aVal = a.car ? `${a.car.company} ${a.car.model}`.toLowerCase() : '';
          bVal = b.car ? `${b.car.company} ${b.car.model}`.toLowerCase() : '';
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
  }, [users, sortKey, sortDirection]);

  const selection = useSelection({
    allItems: users,
    currentPageItems: sortedUsers
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
            cq: carsSearch || undefined,
            cs: initialCarsPage || undefined,
            ct: initialCarsPageSize || undefined,
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
    const deletePromises = selectedItems.map(user => 
      deleteUser(user.id ?? 0)
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
          <FaUsers className="text-2xl" />
          Manage users
        </h1>

        <div className="flex flex-wrap justify-between w-full gap-2">
          <div className="flex gap-2">
            <CreateUserButton onSuccess={refresh} />
            <FillWithUsersButton refresh={refresh} />
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
                  label="User"
                  sortKey="name"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Car"
                  sortKey="car"
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
                  <p className="text-red-500 font-bold w-full flex items-center justify-center text-4xl">{error}</p>
                </FullTableMessage>
              )}
              {sortedUsers.length === 0 && !isLoading && !error && (
                <FullTableMessage>
                  <IoBanOutline className="text-4xl text-neutral-500" />
                  <p className="text-neutral-800 font-semibold text-lg mt-2">No users found</p>
                </FullTableMessage>
              )}
              {sortedUsers.map((user) => (
                <ModernUserRow
                  key={user.id}
                  user={user}
                  cars={Cars}
                  carsTextMatch={carsSearch}
                  textMatch={search}
                  setCarsTextMatch={setCarsSearch}
                  isSelected={selection.isSelected(user.id ?? 0)}
                  onSelectionChange={selection.handleSelection}
                  updateUser={async (newUser: CreateUpdateUserDTO | null, toastId: Id | null) => {
                    if (newUser) {
                      const result = await updateUser(user.id ?? 0, newUser);
                      if (result.error) {
                        toastId && toast.update(toastId, { render: "Failed to update user", type: "error", isLoading: false, autoClose: 5000 });
                      } else {
                        toastId && toast.update(toastId, { render: "User updated", type: "success", isLoading: false, autoClose: 5000 });
                      }
                    } else {
                      const result = await deleteUser(user.id ?? 0);
                      if (result.error) {
                        toastId && toast.update(toastId, { render: "Failed to delete user", type: "error", isLoading: false, autoClose: 5000 });
                      } else {
                        toastId && toast.update(toastId, { render: "User deleted", type: "success", isLoading: false, autoClose: 5000 });
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
        itemType="user"
      />
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { q, s, t } = ctx.query;
  const initialPage = s ? parseInt(s as string) : 0;
  const initialPageSize = t ? parseInt(t as string) : 10;
  const initialSearch = (q as string) || "";

  const users = await API.SSR.Users.SearchUsers({ skip: initialPage * initialPageSize, take: initialPageSize, textMatch: initialSearch });

  const { cq, cs, ct } = ctx.query;
  const CarsSearch = (cq as string) || "";
  const CarsPage = cs ? parseInt(cs as string) : 0;
  const CarsPageSize = ct ? parseInt(ct as string) : 10;
  const Cars = await API.SSR.Cars.SearchCars({ skip: CarsPage * CarsPageSize, take: CarsPageSize, textMatch: CarsSearch });

  return {
    props: {
      initialSearch,
      initialPage,
      initialPageSize,
      initialUsers: users,
      initialCars: Cars,
      initialCarsPage: CarsPage,
      initialCarsPageSize: CarsPageSize,
      initialCarsSearch: CarsSearch,
    },
  };
}
