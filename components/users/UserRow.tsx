import { useEffect, useState } from "react";
import { Id, toast } from "react-toastify";
import { FiTrash } from "react-icons/fi";
import { IoEyeOffOutline, IoEyeOutline, IoPencil } from "react-icons/io5";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Dialog } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CarBasicDTO, CarDTO, CreateUpdateUserDTO, UserDTO } from "@/src/API/AutoShopApi";
import { formatDate } from "@/src/utils/formatDate";
import { Highlight } from "../Highlight";
import { useCarsType } from "@/src/hooks/useCars";
import { createPortal } from "react-dom";
import { IoChevronDownOutline, IoChevronUpOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useDebounce } from "@/src/hooks/useDebounce";

interface UserRowProps {
  user: UserDTO;
  updateUser: (user: CreateUpdateUserDTO | null, toastId: Id | null) => void;
  textMatch?: string;
  cars: useCarsType;
  carsTextMatch?: string;
  setCarsTextMatch: (match: string) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().nullable(),
  carId: Yup.number().nullable(),
});

export default function UserRow({ user, updateUser, cars, textMatch, carsTextMatch, setCarsTextMatch }: UserRowProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    carId: number | null;
  }>({
    name: user.name ?? "",
    email: user.email ?? "",
    password: "",
    carId: user.car?.id ?? null,
  });

  useEffect(() => {
    setFormData({
      name: user.name ?? "",
      email: user.email ?? "",
      password: "",
      carId: user.car?.id ?? null,
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Updating user...");
    const updateData: CreateUpdateUserDTO = {
      name: formData.name,
      email: formData.email,
      password: formData.password || null,
      carId: formData.carId ?? null,
    };
    await updateUser(updateData, toastId);
    setIsEditModalOpen(false);
  };

  return (
    <>
      <tr className="">
        <td className="w-8 text-center whitespace-nowrap text-sm text-gray-500">
          <input type="checkbox" className="w-4 h-4" />
        </td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm flex flex-col ">
          <span className="text-neutral-800 font-semibold text-lg">
            <Highlight text={user.name ?? ""} highlight={textMatch ?? ""} />
          </span>
          <span className="text-gray-500 text-sm">
            <Highlight text={user.email ?? ""} highlight={textMatch ?? ""} />
          </span>
        </td>
        <td className="px-3 py-1.5 w-fit whitespace-nowrap text-sm text-gray-500">
          {user.car ? (
            <span className="text-gray-500">
              <Highlight text={user.car.model ?? ""} highlight={textMatch ?? ""} /> by{" "}
              <Highlight text={user.car.company ?? ""} highlight={textMatch ?? ""} />
            </span>
          ) : (
            <span className="text-gray-500">No car</span>
          )}
        </td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{user.createdAt ? formatDate(user.createdAt) : ""}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{user.updatedAt ? formatDate(user.updatedAt) : ""}</td>
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
      {isEditModalOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/20 bg-opacity-50" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
                <Dialog.Title className="text-xl font-semibold mb-4">Edit User</Dialog.Title>

                <Formik
                  initialValues={formData}
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
                  {({ values, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ring-transparent"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2  ring-transparent"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Update password (optional)
                        </label>
                        <div className="relative">
                          <Field
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md ring-transparent focus:outline-none focus:ring-2 "
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                          >
                            {showPassword ? (
                              <IoEyeOffOutline className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                            ) : (
                              <IoEyeOutline className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                            )}
                          </button>
                        </div>
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label htmlFor="car" className="block text-sm font-medium text-gray-700 mb-1">
                          Car
                        </label>
                        <div className="flex gap-2 items-center">
                          <CarSelect
                            cars={cars}
                            carsTextMatch={carsTextMatch}
                            selectedCarId={formData.carId}
                            setSelectedCarId={(carId) => setFieldValue("carId", carId)}
                            setCarsTextMatch={setCarsTextMatch}
                          />
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
                          disabled={isSubmitting}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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

function CarSelect({
  cars,
  setCarsTextMatch,
  carsTextMatch,
  selectedCarId,
  setSelectedCarId,
}: {
  cars: useCarsType;
  carsTextMatch: string | undefined;
  selectedCarId: number | null;
  setSelectedCarId: (carId: number | null) => void;
  setCarsTextMatch: (match: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(carsTextMatch || "");
  const debouncedInputValue = useDebounce(inputValue, 300);
  const selectedCar = cars.cars.find((car) => car.id === selectedCarId);

  useEffect(() => {
    setCarsTextMatch(debouncedInputValue);
  }, [debouncedInputValue, setCarsTextMatch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  return (
    <div className="w-full relative">
      <Combobox
        value={selectedCar}
        onChange={(car) => {
          setSelectedCarId(car?.id ?? null);
          setIsOpen(false);
        }}
        onClose={() => {
          setCarsTextMatch("");
          setInputValue("");
          setIsOpen(false);
        }}
      >
        <div className="relative">
          <ComboboxInput
            placeholder="Search for a car..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            displayValue={(car: CarDTO) => (car ? `${car?.company} ${car?.model ? "by" : ""} ${car?.model}` : "")}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <IoChevronDownOutline className="h-5 w-5 text-gray-400" />
          </Combobox.Button>
        </div>

        <ComboboxOptions className="absolute z-50 w-full top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto min-h-[40px]">
          {cars.isLoading ? (
            <div className="px-3 py-2 text-sm text-gray-500 text-center min-h-[40px] flex items-center justify-center">Loading cars...</div>
          ) : cars.cars.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500 text-center min-h-[40px] flex items-center justify-center">
              {inputValue ? "No cars found" : "No cars available"}
            </div>
          ) : (
            <>
              {cars.cars.map((car) => (
                <ComboboxOption
                  key={car.id}
                  value={car}
                  className={({ active }) => `px-3 py-2 cursor-pointer text-sm ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"}`}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      <Highlight text={car.model ?? ""} highlight={inputValue ?? ""} />
                      {car.model && (
                        <>
                          {" by "}
                          <Highlight text={car.company ?? ""} highlight={inputValue ?? ""} />
                        </>
                      )}
                    </span>
                    {selectedCarId === car.id && <span className="text-blue-600 text-xs">✓</span>}
                  </div>
                </ComboboxOption>
              ))}

              {(cars.pagination.hasNextPage || cars.pagination.hasPrevPage) && (
                <div className="border-t border-gray-200 px-3 py-2 bg-gray-50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Page {cars.pagination.currentPage + 1} of {cars.pagination.totalPages}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (cars.pagination.hasPrevPage) {
                            cars.pagination.setPage(cars.pagination.currentPage - 1);
                          }
                        }}
                        disabled={!cars.pagination.hasPrevPage}
                        className={`p-1 rounded ${cars.pagination.hasPrevPage ? "text-gray-600 hover:bg-gray-200" : "text-gray-300 cursor-not-allowed"
                          }`}
                      >
                        <IoChevronBackOutline className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (cars.pagination.hasNextPage) {
                            cars.pagination.setPage(cars.pagination.currentPage + 1);
                          }
                        }}
                        disabled={!cars.pagination.hasNextPage}
                        className={`p-1 rounded ${cars.pagination.hasNextPage ? "text-gray-600 hover:bg-gray-200" : "text-gray-300 cursor-not-allowed"
                          }`}
                      >
                        <IoChevronForwardOutline className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
