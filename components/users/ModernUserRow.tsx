import { useState, useRef, useEffect } from "react";
import { Id, toast } from "react-toastify";
import { FiTrash, FiMoreVertical, FiCopy, FiEdit } from "react-icons/fi";
import { IoPersonCircleOutline, IoCar } from "react-icons/io5";
import { Dialog } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CarBasicDTO, CarDTO, CreateUpdateUserDTO, UserDTO } from "@/src/API/AutoShopApi";
import { formatDate } from "@/src/utils/formatDate";
import { Highlight } from "../Highlight";
import { useCarsType } from "@/src/hooks/useCars";
import { createPortal } from "react-dom";
import { useOutsideClick } from "@/src/hooks/useOutsideClick";

interface ModernUserRowProps {
  user: UserDTO;
  updateUser: (user: CreateUpdateUserDTO | null, toastId: Id | null) => void;
  textMatch?: string;
  cars: useCarsType;
  carsTextMatch?: string;
  setCarsTextMatch: (match: string) => void;
  isSelected: boolean;
  onSelectionChange: (userId: number, selected: boolean, isShiftClick: boolean) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().nullable(),
  carId: Yup.number().nullable(),
});

export default function ModernUserRow({ 
  user, 
  updateUser, 
  cars, 
  textMatch, 
  carsTextMatch, 
  setCarsTextMatch,
  isSelected,
  onSelectionChange
}: ModernUserRowProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCarTooltip, setShowCarTooltip] = useState(false);
  
  const { outsideClickRef: menuRef } = useOutsideClick<HTMLDivElement>(() => setIsMenuOpen(false));
  const { outsideClickRef: carTooltipRef } = useOutsideClick<HTMLDivElement>(() => setShowCarTooltip(false));

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelectionChange(user.id ?? 0, e.target.checked, (e.nativeEvent as MouseEvent).shiftKey);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("ID copied to clipboard");
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting user...");
    await updateUser(null, toastId);
    setIsMenuOpen(false);
  };

  return (
    <>
      <tr className="hover:bg-gray-50 border-b border-gray-100">
        <td className="w-12 px-4 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
        </td>
        
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <IoPersonCircleOutline className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <div className="font-medium text-gray-900">
                <Highlight text={user.name ?? ""} highlight={textMatch ?? ""} />
              </div>
              <div className="text-sm text-gray-500">
                <Highlight text={user.email ?? ""} highlight={textMatch ?? ""} />
              </div>
            </div>
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="relative">
            {user.car ? (
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm cursor-pointer hover:bg-blue-100"
                onMouseEnter={() => setShowCarTooltip(true)}
                onMouseLeave={() => setShowCarTooltip(false)}
                ref={carTooltipRef}
              >
                <IoCar className="w-4 h-4" />
                <span>
                  <Highlight text={user.car.company ?? ""} highlight={textMatch ?? ""} />
                  {" "}
                  <Highlight text={user.car.model ?? ""} highlight={textMatch ?? ""} />
                </span>
                
                {showCarTooltip && (
                  <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                    Car: {user.car.company} {user.car.model}
                    <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-sm">
                <IoCar className="w-4 h-4" />
                No car assigned
              </span>
            )}
          </div>
        </td>

        <td className="px-4 py-4 text-sm text-gray-500">
          {user.updatedAt ? formatDate(user.updatedAt) : "Never"}
        </td>

        <td className="px-4 py-4 text-sm text-gray-500">
          {user.createdAt ? formatDate(user.createdAt) : "Unknown"}
        </td>

        <td className="px-4 py-4">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <FiMoreVertical className="w-4 h-4" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiEdit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => copyToClipboard(user.id?.toString() ?? "")}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <FiCopy className="w-4 h-4" />
                    Copy ID ({user.id})
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FiTrash className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>

      {isEditModalOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/20 bg-opacity-50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
                <Dialog.Title className="text-xl font-semibold mb-4">Edit User</Dialog.Title>
                <Formik
                  initialValues={{
                    name: user.name ?? "",
                    email: user.email ?? "",
                    password: "",
                    carId: user.car?.id ?? null,
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    const toastId = toast.loading("Updating user...");
                    const updateData: CreateUpdateUserDTO = {
                      name: values.name,
                      email: values.email,
                      password: values.password || null,
                      carId: values.carId,
                    };
                    await updateUser(updateData, toastId);
                    setIsEditModalOpen(false);
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password (optional)
                        </label>
                        <Field
                          type="password"
                          id="password"
                          name="password"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          type="button"
                          onClick={() => setIsEditModalOpen(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                        >
                          Save Changes
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </div>
          </Dialog>,
          document.body
        )}
    </>
  );
}