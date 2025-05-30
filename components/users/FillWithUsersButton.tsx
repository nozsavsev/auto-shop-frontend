import { toast } from "react-toastify";
import UsersAPI from "@/src/Users";

interface FillWithUsersButtonProps {
  refresh: () => void;
}

export default function FillWithUsersButton({ refresh }: FillWithUsersButtonProps) {
  return (
    <button
      className="bg-white text-black px-2 py-1 rounded-md flex items-center border border-gray-200 cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50 hover:border-gray-300"
      onClick={async () => {
        const toastId = toast.loading("Filling with 1000 users... 0%", { autoClose: false });
        let created = 0;
        const total = 1000;
        function randomUser() {
          const id = Math.floor(Math.random() * 1000000);
          return {
            name: `User${id}`,
            email: `user${id}@example.com`,
            password: "password123",
          };
        }
        for (let i = 0; i < total; i++) {
          const user = randomUser();
          await UsersAPI.createUser(user);
          created++;
          const percent = Math.min(100, Math.round((created / total) * 100));
          toast.update(toastId, { render: `Filling with 1000 users... ${percent}%`, progress: percent / 100 });
        }
        toast.update(toastId, { render: "1000 users created!", type: "success", isLoading: false, autoClose: 3000, progress: 1 });
        refresh();
      }}
    >
      Fill with 1000 users
    </button>
  );
} 