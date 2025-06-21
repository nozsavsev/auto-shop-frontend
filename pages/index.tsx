import { useUsers } from "@/src/hooks/useUsers";
import { useState, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoBanOutline, IoRefreshOutline } from "react-icons/io5";
import { Id, toast } from "react-toastify";
import CreateUserButton from "@/components/users/CreateUserButton";
import UserRow from "../components/users/UserRow";
import Pagination from "../components/Pagination";
import FillWithUsersButton from "../components/users/FillWithUsersButton";
import { CarDTO, CreateUpdateUserDTO } from "@/src/API/AutoShopApi";
import { API } from "@/src/API";

export default function Users() {
  const { users, isLoading, error, refresh, pagination, updateUser, deleteUser } = useUsers();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [carsLoading, setCarsLoading] = useState(false);

  const fetchCars = async () => {
    setCarsLoading(true);
    const res = await API.Client.Cars.GetCars({ skip: 0, take: 1000 });
    setCars(res.data?.cars || []);
    setCarsLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden p-6 max-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex flex-wrap gap-2">
          <CreateUserButton onSuccess={refresh} />
          <FillWithUsersButton refresh={refresh} />
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
            <IoRefreshOutline className={`mr-2 transition-transform duration-300 ease-in-out ${isRefreshing ? "animate-[spin_1s_linear_infinite]" : ""}`} />
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
                      <p className="mt-2 font-semibold text-lg text-gray-600">Loading users...</p>
                    </div>
                  </td>
                </tr>
              )}
              {users.length === 0 && !isLoading && !error && (
                <tr>
                  <td colSpan={80} className="h-96">
                    <div className="flex flex-col h-full flex-1 grow items-center justify-center">
                      <IoBanOutline className="text-4xl text-neutral-500" />
                      <p className="text-neutral-800 font-semibold text-lg mt-2">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  cars={cars}
                  carsLoading={carsLoading}
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
          <Pagination pagination={pagination} />
        </div>
      </div>
    </div>
  );
}
