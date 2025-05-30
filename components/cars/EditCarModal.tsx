import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { CarDTO, createUpdateCarDTO } from "@/src/types";

interface EditCarModalProps {
  open: boolean;
  onClose: () => void;
  car: CarDTO;
  onSave: (data: createUpdateCarDTO) => Promise<void>;
  loading?: boolean;
}

export default function EditCarModal({ open, onClose, car, onSave, loading }: EditCarModalProps) {
  const [formData, setFormData] = useState({ company: car.company, model: car.model });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 w-full">
          <Dialog.Title className="text-xl font-semibold mb-4">Edit Car</Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
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
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
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
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isSubmitting || loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isSubmitting || loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 