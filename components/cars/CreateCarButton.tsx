import { useState } from "react";
import { toast } from "react-toastify";
import { IoAddOutline, IoShuffleOutline } from "react-icons/io5";
import { Dialog } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API } from "@/src/API";
import { faker } from "@faker-js/faker";

interface CreateCarButtonProps {
  onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
  company: Yup.string()
    .required("Company is required")
    .max(100, "Company must be 100 characters or less"),
  model: Yup.string()
    .required("Model is required")
    .max(100, "Model must be 100 characters or less"),
});

function randomCar() {
  return {
    company: faker.vehicle.manufacturer(),
    model: faker.vehicle.model(),
  };
}

export default function CreateCarButton({ onSuccess }: CreateCarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center hover:bg-blue-700 transition-colors cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <IoAddOutline className="mr-2" />
        Create Car
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 w-full">
            <Formik
              initialValues={{ company: "", model: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                const toastId = toast.loading("Creating car...");
                try {
                  const response = await API.Client.Cars.CreateCar({ createUpdateCarDTO: values });
                  if (response.error) {
                    toast.update(toastId, { render: "Failed to create car", type: "error", isLoading: false, autoClose: 3000 });
                  } else {
                    toast.update(toastId, { render: "Car created successfully", type: "success", isLoading: false, autoClose: 3000 });
                    setIsOpen(false);
                    resetForm();
                    onSuccess();
                  }
                } catch (error) {
                  toast.update(toastId, { render: "An error occurred", type: "error", isLoading: false, autoClose: 3000 });
                }
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, setFieldValue }) => (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-lg font-medium">Create New Car</Dialog.Title>
                    <button
                      type="button"
                      onClick={() => {
                        const randomData = randomCar();
                        setFieldValue("company", randomData.company);
                        setFieldValue("model", randomData.model);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-white border border-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <IoShuffleOutline className="text-lg" />
                      Generate Random
                    </button>
                  </div>

                  <Form className="space-y-4">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                        Company
                      </label>
                      <Field
                        name="company"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ring-transparent"
                      />
                      <ErrorMessage name="company" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                        Model
                      </label>
                      <Field
                        name="model"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 ring-transparent"
                      />
                      <ErrorMessage name="model" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? "Creating..." : "Create Car"}
                      </button>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
} 