import { useState } from "react";
import { UserDTO, createUpdateUserDTO, CarDTO } from "@/src/types";
import { Id, toast } from "react-toastify";
import { FiTrash } from "react-icons/fi";
import { IoPencil } from "react-icons/io5";
import CarsAPI from "@/src/Cars";

interface UserRowProps {
  user: UserDTO;
  updateUser: (user: createUpdateUserDTO | null, toastId: Id | null) => void;
  cars: CarDTO[];
  carsLoading: boolean;
  refreshCars: () => void;
}

export default function UserRow({ user, updateUser, cars, carsLoading, refreshCars }: UserRowProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    carId: number | null;
  }>({
    name: user.name,
    email: user.email,
    password: "",
    carId: user.car?.id ?? null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Updating user...");
    const updateData: createUpdateUserDTO = {
      name: formData.name,
      email: formData.email,
      password: formData.password || null,
      carId: formData.carId ?? null,
    };
    await updateUser(updateData, toastId);
    setIsEditModalOpen(false);
  };

  const handleDeleteCar = async () => {
    if (!formData.carId) return;
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    const toastId = toast.loading("Deleting car...");
    const res = await CarsAPI.deleteCar(formData.carId);
    if (res.error) {
      toast.update(toastId, { render: "Failed to delete car", type: "error", isLoading: false, autoClose: 3000 });
    } else {
      toast.update(toastId, { render: "Car deleted", type: "success", isLoading: false, autoClose: 3000 });
      setFormData({ ...formData, carId: null });
      refreshCars();
    }
  };

  return (
    <>
      <tr className="divide-x divide-gray-200">
        <td className="w-8 text-center whitespace-nowrap text-sm text-gray-500">
          <button onClick={() => setIsEditModalOpen(true)} className="text-blue-600 hover:text-blue-700 cursor-pointer" title="Edit user">
            <IoPencil className="w-4 h-4" />
          </button>
        </td>
        <td className="text-center px-1 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
        <td className="px-3 py-1.5 w-fit whitespace-nowrap text-sm text-gray-500">
          {user.car ? (
            <span className="text-gray-500">
              {user.car.model} by {user.car.company}
            </span>
          ) : (
            <span className="text-gray-500">No car</span>
          )}
        </td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{user.createdAt.toLocaleString()}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{user.updatedAt.toLocaleString()}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">
          <button
            className="text-red-600 hover:text-red-700 cursor-pointer"
            onClick={async () => {
              const toastId = toast.loading("Deleting user...");
              await updateUser(null, toastId);
            }}
          >
            <FiTrash />
          </button>
        </td>
      </tr>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password (optional)
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave empty to keep current password"
                />
              </div>
              <div>
                <label htmlFor="car" className="block text-sm font-medium text-gray-700 mb-1">
                  Car
                </label>
                <div className="flex gap-2 items-center">
                  <select
                    id="car"
                    value={formData.carId !== null ? formData.carId : ""}
                    onChange={(e) => setFormData({ ...formData, carId: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={carsLoading}
                  >
                    <option value="">No car</option>
                    {cars.map((car) => (
                      <option key={car.id} value={car.id}>
                        {car.company} {car.model}
                      </option>
                    ))}
                  </select>
                  {formData.carId && (
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700 px-2 py-1 rounded-md border border-red-200 bg-red-50"
                      onClick={handleDeleteCar}
                      title="Delete selected car"
                    >
                      <FiTrash />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
