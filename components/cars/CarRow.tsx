import { useState } from "react";
import { CarDTO, createUpdateCarDTO } from "@/src/types";
import { Id, toast } from "react-toastify";
import { FiTrash } from "react-icons/fi";
import { IoPencil } from "react-icons/io5";

interface CarRowProps {
  car: CarDTO;
  updateCar: (car: createUpdateCarDTO | null, toastId: Id | null) => void;
}

export default function CarRow({ car, updateCar }: CarRowProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: car.company,
    model: car.model,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Updating car...");
    const updateData: createUpdateCarDTO = {
      company: formData.company,
      model: formData.model,
    };
    await updateCar(updateData, toastId);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <tr className="divide-x divide-gray-200">
        <td className="w-8 text-center whitespace-nowrap text-sm text-gray-500">
          <button onClick={() => setIsEditModalOpen(true)} className="text-blue-600 hover:text-blue-700 cursor-pointer" title="Edit car">
            <IoPencil className="w-4 h-4" />
          </button>
        </td>
        <td className="text-center px-1 whitespace-nowrap text-sm text-gray-500">{car.id}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{car.company}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{car.model}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{car.users.length > 0 ? car.users.length : "No "} users</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{car.createdAt.toLocaleString()}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{car.updatedAt.toLocaleString()}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">
          <button
            className="text-red-600 hover:text-red-700 cursor-pointer"
            onClick={async () => {
              const toastId = toast.loading("Deleting car...");
              await updateCar(null, toastId);
            }}
          >
            <FiTrash />
          </button>
        </td>
      </tr>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Car</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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