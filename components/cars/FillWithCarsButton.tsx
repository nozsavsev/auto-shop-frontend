import { API } from "@/src/API";
import { faker } from "@faker-js/faker";
import { toast } from "react-toastify";

interface FillWithCarsButtonProps {
  refresh: () => void;
}

export default function FillWithCarsButton({ refresh }: FillWithCarsButtonProps) {
  return (
    <button
      className="bg-white text-black px-2 py-1 rounded-md flex items-center border border-gray-200 cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50 hover:border-gray-300"
      onClick={async () => {
        const toastId = toast.loading("Filling with 1000 cars... 0%", { autoClose: false });
        let created = 0;
        const total = 1000;
        function randomCar() {
          return {
            company: faker.vehicle.manufacturer(),
            model: faker.vehicle.model(),
          };
        }
        for (let i = 0; i < total; i++) {
          const car = randomCar();
          await API.Client.Cars.CreateCar({ createUpdateCarDTO: car });
          created++;
          const percent = Math.min(100, Math.round((created / total) * 100));
          toast.update(toastId, { render: `Filling with 1000 cars... ${percent}%`, progress: percent / 100 });
        }
        toast.update(toastId, { render: "1000 cars created!", type: "success", isLoading: false, autoClose: 3000, progress: 1 });
        refresh();
      }}
    >
      Fill with 1000 cars
    </button>
  );
} 