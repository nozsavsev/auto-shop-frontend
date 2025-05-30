import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import CreateUserForm from "./CreateUserForm";
import { createUpdateUserDTO } from "@/src/types";
import { Id, toast } from "react-toastify";
import UsersAPI from "@/src/Users";

interface CreateUserButtonProps {
  onSuccess: () => void;
}

export default function CreateUserButton({ onSuccess }: CreateUserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (values: Omit<createUpdateUserDTO, "carId">, { setSubmitting, resetForm }: any) => {
    const toastId = toast.loading("Creating user...");
    try {
      const response = await UsersAPI.createUser({ ...values, carId: null });
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