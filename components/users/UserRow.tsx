import { useEffect, useState } from "react";
import { Id, toast } from "react-toastify";
import { FiTrash } from "react-icons/fi";
import { IoEyeOffOutline, IoEyeOutline, IoPencil } from "react-icons/io5";
import { Dialog } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CarDTO, CreateUpdateUserDTO, UserDTO } from "@/src/API/AutoShopApi";

interface UserRowProps {
  user: UserDTO;
  updateUser: (user: CreateUpdateUserDTO | null, toastId: Id | null) => void;
  cars: CarDTO[];
  carsLoading: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().nullable(),
  carId: Yup.number().nullable(),
});

export default function UserRow({ user, updateUser, cars, carsLoading }: UserRowProps) {
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
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{user.createdAt?.toLocaleString()}</td>
        <td className="px-3 py-1.5 whitespace-nowrap text-sm text-gray-500">{user.updatedAt?.toLocaleString()}</td>
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
                        Password (optional)
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
                        <Field
                          as="select"
                          id="car"
                          name="carId"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={carsLoading}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setFieldValue("carId", e.target.value ? Number(e.target.value) : null);
                          }}
                        >
                          <option value="">No car</option>
                          {cars.map((car) => (
                            <option key={car.id} value={car.id}>
                              {car.company} {car.model}
                            </option>
                          ))}
                        </Field>
                        
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
        </Dialog>
      )}
    </>
  );
}
