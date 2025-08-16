import { API } from "@/src/API";
import { faker } from "@faker-js/faker";
import { toast } from "react-toastify";

interface FillWithUsersButtonProps {
  refresh: () => void;
}

export default function FillWithUsersButton({ refresh }: FillWithUsersButtonProps) {
  
  if (process.env.NODE_ENV != "development")
    return null;

  return (
    <button
      className="bg-white text-black px-2 py-1 rounded-md flex items-center border border-gray-200 cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50 hover:border-gray-300"
      onClick={async () => {
        let created = 0;
        const total = 10_000;
        const toastId = toast.loading(`Generating ${total} users... 0%`, { autoClose: false });
        function randomUser() {
          return {
            name: `${faker.person.firstName()} ${faker.person.lastName()}`,
            email: faker.internet.email(),
            password: faker.internet.password({ length: 12 }),
          };
        }
        const users = [];
        for (let i = 0; i < total; i++) {
          const user = randomUser();
          // await API.Client.Users.CreateUser({ createUserDTO: user });
          users.push(user);
          created++;
          const percent = Math.min(100, Math.round((created / total) * 100));
          toast.update(toastId, { render: `Generating ${total} users... ${percent}%`, progress: percent / 100 });
        }
        toast.update(toastId, { render: `Uploading ${total} users...`, progress: 0 });

        await API.Client.Users.BulkCreateUsers({ createUserDTO: users });

        toast.update(toastId, { render: `${total} users created!`, type: "success", isLoading: false, autoClose: 3000, progress: 1 });
        refresh();
      }}
    >
      Fill with 1000 users
    </button>
  );
} 