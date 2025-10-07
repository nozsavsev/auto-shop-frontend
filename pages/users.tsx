import { IoBanOutline } from "react-icons/io5";
import { Id, toast } from "react-toastify";
import UserRow from "@/components/users/UserRow";
import FillWithUsersButton from "@/components/users/FillWithUsersButton";
import CreateUserButton from "@/components/users/CreateUserButton";
import Pagination from "@/components/Pagination";
import { AllUsersDTO, UpdateUserDTO, UserSortByNullable } from "@/src/API/AutoShopApi";
import { useUsers } from "@/src/hooks/useUsers";
import { useCars } from "@/src/hooks/useCars";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API, ResponseWrapper } from "@/src/API";
import { GetServerSidePropsContext } from "next";
import { FaUsers } from "react-icons/fa";
import { SearchBar } from "@/components/SearchBar";
import { FullTableMessage } from "@/components/FullTableMessage";
import { useSelection } from "@/src/hooks/useSelection";
import BatchActions from "@/components/BatchActions";
import SortableHeader, { SortDirection } from "@/components/SortableHeader";

type UsersPageProps = {
  initialSearch: string;
  initialPage: number;
  initialPageSize: number;
  initialUsers: ResponseWrapper<AllUsersDTO>;
  initialSortBy?: UserSortByNullable;
};

export default function Users({ initialSearch, initialPage, initialPageSize, initialUsers, initialSortBy }: UsersPageProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [carsTextMatch, setCarsTextMatch] = useState("");

  const { users, isLoading, error, refresh, updateUser, deleteUser, pagination, sorting } = useUsers({
    initialPage,
    initialPageSize,
    textMatch: search,
    initialData: initialUsers,
    initialSortBy: initialSortBy,
  });

  const cars = useCars({
    initialPage: 0,
    initialPageSize: 100,
    textMatch: carsTextMatch,
  });

  // Map UI sort to API enum
  const applySort = (key: string | null, dir: SortDirection) => {
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
    sorting.setSortBy(apiSort);
  };

  const selection = useSelection({
    allItems: users || [],
    currentPageItems: users || [],
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
    const deletePromises = selectedItems.map(user =>
      deleteUser(user.id ?? 0)
    );

    await Promise.all(deletePromises);
    selection.clearSelection();
    refresh();
  };

  return (
    <div className="flex flex-col w-full p-6 ">
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
                  label="Email"
                  sortKey="email"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  disabled={true}
                  label="Car"
                  sortKey="none"
                  currentSortKey={sortKey}
                  currentDirection={sortDirection}
                  onSort={handleSort}
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
                  <p className="text-red-500 font-bold w-full flex items-center justify-center text-4xl">
                    {typeof error === "string" ? error : "An error occurred"}
                  </p>
                </FullTableMessage>
              )}
              {(users?.length || 0) === 0 && !isLoading && !error && (
                <FullTableMessage>
                  <IoBanOutline className="text-4xl text-neutral-500" />
                  <p className="text-neutral-800 font-semibold text-lg mt-2">No users found</p>
                </FullTableMessage>
              )}
              {users?.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  textMatch={search}
                  cars={cars}
                  carsTextMatch={carsTextMatch}
                  setCarsTextMatch={setCarsTextMatch}
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

        <div className={`${selection.getSelectedCount() === 0 ? "h-12 sm:h-10" : "h-20 sm:h-16"}`} />
        <div className={`sticky ${selection.getSelectedCount() === 0 ? "bottom-16" : "bottom-24"} flex items-center justify-center h-0 z-50`}>
          <div className="flex flex-col items-center gap-2 justify-center">
            <BatchActions
              selectedCount={selection.getSelectedCount()}
              hiddenSelectedCount={selection.getHiddenSelectedCount()}
              onBatchDelete={handleBatchDelete}
              onClearSelection={selection.clearSelection}
              itemType="user"
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

  const users = await API.SSR.Users.SearchUsers({
    skip: initialPage * initialPageSize,
    take: initialPageSize,
    textMatch: initialSearch,
    sortBy: (o as UserSortByNullable) || undefined,
  });

  console.log({ initialSearch, initialPage, initialPageSize, initialUsers: users });

  return {
    props: {
      initialSearch,
      initialPage,
      initialPageSize,
      initialUsers: users,
      initialSortBy: ((o as UserSortByNullable) || null) ?? null,
    },
  };
}
