import { useState } from "react";
import { IoAddOutline, IoEyeOffOutline, IoEyeOutline, IoShuffleOutline } from "react-icons/io5";
import { Id, toast } from "react-toastify";
import { Field, Formik, Form} from "formik";
import { faker } from "@faker-js/faker";
import { Dialog } from "@headlessui/react";
import * as Yup from "yup";
import { API } from "@/src/API";
import { CreateUpdateUserDTO } from "@/src/API/AutoShopApi";

interface CreateUserButtonProps {
  onSuccess: () => void;
}

export default function CreateUserButton({ onSuccess }: CreateUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (values: Omit<CreateUpdateUserDTO, "carId">, { setSubmitting, resetForm }: any) => {
    const toastId = toast.loading("Creating user...");
    try {
      const response = await API.Client.Users.CreateUser({ createUpdateUserDTO: values });
      if (response.error) {
        toast.update(toastId, { render: "Failed to create user", type: "error", isLoading: false, autoClose: 3000 });
      } else {
        toast.update(toastId, { render: "User created successfully", type: "success", isLoading: false, autoClose: 3000 });
        setIsOpen(false);
        resetForm();
        onSuccess();
      }
    } catch (error) {
      toast.update(toastId, { render: "An error occurred", type: "error", isLoading: false, autoClose: 3000 });
    }
    setSubmitting(false);
  };

  return (
    <>
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center hover:bg-blue-700 transition-colors cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <IoAddOutline className="mr-2" />
        Create User
      </button>

      <CreateUserForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
} 


const AddUserSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

interface CreateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<CreateUpdateUserDTO, "carId">, helpers: any) => Promise<void>;
}

function CreateUserForm({ isOpen, onClose, onSubmit }: CreateUserFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const generateRandomData = (setFieldValue: (field: string, value: any) => void) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    setFieldValue("name", `${firstName} ${lastName}`);
    setFieldValue("email", faker.internet.email({ firstName, lastName }));
    setFieldValue("password", faker.internet.password({ length: 12 }));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 w-full">
          <Formik
            initialValues={{ name: "", email: "", password: "" } as Omit<CreateUpdateUserDTO, "carId">}
            validationSchema={AddUserSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
              <>
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-medium">Add New User</Dialog.Title>
                  <button
                    type="button"
                    onClick={() => generateRandomData(setFieldValue)}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-white border  border-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    <IoShuffleOutline className="text-lg" />
                    Generate Random
                  </button>
                </div>

                <Form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <Field name="name" type="text" className="w-full px-3 py-2 border ring-transparent border-gray-300 rounded-md focus:outline-none focus:ring-2 " />
                    {errors.name && touched.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md ring-transparent focus:outline-none focus:ring-2 "
                    />
                    {errors.email && touched.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2  ring-transparent"
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
                    {errors.password && touched.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Creating..." : "Create User"}
                    </button>
                  </div>
                </Form> 
              </>
            )}
          </Formik>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
