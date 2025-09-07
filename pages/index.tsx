import { useUsers } from "@/src/hooks/useUsers";
import { useState, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoBanOutline, IoRefreshOutline } from "react-icons/io5";
import { Id, toast } from "react-toastify";
import CreateUserButton from "@/components/users/CreateUserButton";
import UserRow from "../components/users/UserRow";
import Pagination from "../components/Pagination";
import FillWithUsersButton from "../components/users/FillWithUsersButton";
import { AllCarsDTO, AllUsersDTO, UpdateUserDTO, UserSortByNullable, CarSortByNullable } from "@/src/API/AutoShopApi";
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
  initialUserSortBy?: UserSortByNullable;
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
  initialUserSortBy,
}: UsersPageProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const { users, isLoading, error, refresh, pagination, updateUser, deleteUser, sorting: userSorting } = useUsers(
    initialPage,
    initialPageSize,
    search,
    initialUsers,
    initialUserSortBy
  );

  const [carsSearch, setCarsSearch] = useState(initialCarsSearch);

  const Cars = useCars({ initialPage: initialCarsPage, initialPageSize: initialCarsPageSize, textMatch: carsSearch, initialData: initialCars, initialSortBy: undefined });

  const applyUserSort = (key: string | null, dir: SortDirection) => {
    let apiSort: UserSortByNullable | undefined = undefined;
    if (key && dir) {
      switch (key) {
        case 'name':
          apiSort = dir === 'asc' ? UserSortByNullable.NameAsc : UserSortByNullable.NameDesc;
          break;
        case 'email':
          apiSort = dir === 'asc' ? UserSortByNullable.EmailAsc : UserSortByNullable.EmailDesc;
          break;
        case 'createdAt':
          apiSort = dir === 'asc' ? UserSortByNullable.CreatedAtAsc : UserSortByNullable.CreatedAtDesc;
          break;
        case 'updatedAt':
          apiSort = dir === 'asc' ? UserSortByNullable.UpdatedAtAsc : UserSortByNullable.UpdatedAtDesc;
          break;
        default:
          apiSort = undefined;
      }
    }
    userSorting.setSortBy(apiSort);
  };

  const selection = useSelection({
    allItems: users,
    currentPageItems: users,
  });

  const { currentPage, pageSize } = pagination;

  // Sync initial sort enum to UI indicators
  useEffect(() => {
    if (!initialUserSortBy) return;
    switch (initialUserSortBy) {
      case UserSortByNullable.NameAsc:
        setSortKey('name'); setSortDirection('asc'); break;
      case UserSortByNullable.NameDesc:
        setSortKey('name'); setSortDirection('desc'); break;
      case UserSortByNullable.EmailAsc:
        setSortKey('email'); setSortDirection('asc'); break;
      case UserSortByNullable.EmailDesc:
        setSortKey('email'); setSortDirection('desc'); break;
      case UserSortByNullable.CreatedAtAsc:
        setSortKey('createdAt'); setSortDirection('asc'); break;
      case UserSortByNullable.CreatedAtDesc:
        setSortKey('createdAt'); setSortDirection('desc'); break;
      case UserSortByNullable.UpdatedAtAsc:
        setSortKey('updatedAt'); setSortDirection('asc'); break;
      case UserSortByNullable.UpdatedAtDesc:
        setSortKey('updatedAt'); setSortDirection('desc'); break;
      default:
        break;
    }
  }, [initialUserSortBy]);

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
            uo: userSorting.sortBy || undefined,
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [search, currentPage, pageSize, userSorting.sortBy, router.isReady]);

  const handleSort = (key: string, direction: SortDirection) => {
    setSortKey(key);
    setSortDirection(direction);
    applyUserSort(key, direction);
  };

  const handleRemoveCars = async () => {
    const selectedItems = selection.getSelectedItems();
    const updatePromises = selectedItems.map(user =>
      updateUser(user.id ?? 0, { ...(users.find(u => u.id === user.id) as UpdateUserDTO), carId: null })
    );
    await Promise.all(updatePromises);
    await refresh();
  };

  const handleBatchDelete = async () => {
    const selectedItems = selection.getSelectedItems();
    const deletePromises = selectedItems.map(user =>
      deleteUser(user.id ?? 0)
    );

    await Promise.all(deletePromises);
    selection.clearSelection();
    pagination.setPage(0);
    await refresh();
  };

  return (
    <div className="flex flex-col w-full p-6">
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
                    className="w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
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
                  label="Email"
                  sortKey="email"
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
                  disabled={true}
                />
                <SortableHeader
                  label="Last updated"
                  sortKey="updatedAt"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Date created"
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
              {(users.length === 0) && !isLoading && !error && (
                <FullTableMessage>
                  <IoBanOutline className="text-4xl text-neutral-500" />
                  <p className="text-neutral-800 font-semibold text-lg mt-2">No users found</p>
                </FullTableMessage>
              )}
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  cars={Cars}
                  carsTextMatch={carsSearch}
                  textMatch={search}
                  setCarsTextMatch={setCarsSearch}
                  isSelected={selection.isSelected(user.id ?? 0)}
                  onSelectionChange={selection.handleSelection}
                  updateUser={async (newUser: UpdateUserDTO | null, toastId: Id | null) => {
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
        <div className={`${selection.getSelectedCount() === 0 ? "h-12 sm:h-10" : "h-26 sm:h-16"}`} />
        <div className={`sticky ${selection.getSelectedCount() === 0 ? "bottom-16" : "bottom-24"} flex items-center justify-center h-0 z-50`}>
          <div className="flex flex-col items-center gap-2 justify-center">
            <BatchActions
              selectedCount={selection.getSelectedCount()}
              hiddenSelectedCount={selection.getHiddenSelectedCount()}
              onBatchDelete={handleBatchDelete}
              onRemoveCars={handleRemoveCars}
              onClearSelection={selection.clearSelection}
              itemType="user"
            />
            <Pagination pagination={pagination} />
          </div>
        </div>
        <div className={`${selection.getSelectedCount() === 0 ? "h-6 sm:h-6" : "h-20 sm:h-12"}`} />
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { q, s, t, uo, cq, cs, ct, co } = ctx.query;
  const initialPage = s ? parseInt(s as string) : 0;
  const initialPageSize = t ? parseInt(t as string) : 10;
  const initialSearch = (q as string) || "";

  const users = await API.SSR.Users.SearchUsers({
    skip: initialPage * initialPageSize,
    take: initialPageSize,
    textMatch: initialSearch,
    sortBy: (uo as UserSortByNullable) || undefined,
  });

  const CarsSearch = (cq as string) || "";
  const CarsPage = cs ? parseInt(cs as string) : 0;
  const CarsPageSize = ct ? parseInt(ct as string) : 10;
  const Cars = await API.SSR.Cars.SearchCars({
    skip: CarsPage * CarsPageSize,
    take: CarsPageSize,
    textMatch: CarsSearch,
    sortBy: (co as CarSortByNullable) || undefined,
  });

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
      initialUserSortBy: ((uo as UserSortByNullable) || null) ?? null,
    },
  };
}
