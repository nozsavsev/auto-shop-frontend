import { useUsers } from "@/src/hooks/useUsers";
import { useState, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoBanOutline, IoRefreshOutline } from "react-icons/io5";
import { Id, toast } from "react-toastify";
import CreateUserButton from "@/components/users/CreateUserButton";
import UserRow from "../components/users/UserRow";
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
  const { users, isLoading, error, refresh, pagination, updateUser, deleteUser } = useUsers(initialPage, initialPageSize, search, initialUsers);

  const [carsSearch, setCarsSearch] = useState(initialCarsSearch);

  const Cars = useCars({ initialPage: initialCarsPage, initialPageSize: initialCarsPageSize, textMatch: carsSearch, initialData: initialCars });

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
            <thead className="bg-white text-gray-500 uppercase text-xs sticky top-0 z-10">
              <tr className="divide-x divide-gray-200">
                <th className="font-semibold min-w-8 text-right bg-white" />
                <th className="font-semibold w-8 text-center bg-white">ID</th>
                <th className="font-semibold px-3 py-1.5 bg-white">Name</th>
                <th className="font-semibold px-3 py-1.5 bg-white">Email</th>
                <th className="font-semibold px-3 py-1.5 bg-white">Car</th>
                <th className="font-semibold px-3 py-1.5 bg-white">Created At</th>
                <th className="font-semibold px-3 py-1.5 bg-white">Updated At</th>
                <th className="font-semibold w-8 px-3 py-1.5 bg-white" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {error && (
                <FullTableMessage>
                  <p className="text-red-500 font-bold w-full flex items-center justify-center text-4xl">{error}</p>
                </FullTableMessage>
              )}
              {users.length === 0 && !isLoading && !error && (
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
