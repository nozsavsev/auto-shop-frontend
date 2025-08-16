import { API } from "@/src/API";
import { faker } from "@faker-js/faker";
import { toast } from "react-toastify";

interface FillWithCarsButtonProps {
  refresh: () => void;
}

export default function FillWithCarsButton({ refresh }: FillWithCarsButtonProps) {

  if (process.env.NODE_ENV != "development")
    return null;

  return (
    <button
      className="bg-white text-black px-2 py-1 rounded-md flex items-center border border-gray-200 cursor-pointer transition-all duration-200 ease-in-out hover:bg-gray-50 hover:border-gray-300"
      onClick={async () => {
        let created = 0;
        const total = 10_000;
        const toastId = toast.loading(`Generating ${total} cars... 0%`, { autoClose: false });
        function randomCar() {
          return {
            company: faker.vehicle.manufacturer(),
            model: faker.vehicle.model(),
          };
        }
        const cars = [];
        for (let i = 0; i < total; i++) {
          const car = randomCar();
          // await API.Client.Cars.CreateCar({ createUpdateCarDTO: car });
          cars.push(car);
          created++;
          const percent = Math.min(100, Math.round((created / total) * 100));
          toast.update(toastId, { render: `Generating ${total} cars... ${percent}%`, progress: percent / 100 });
        }

        toast.update(toastId, { render: `Uploading ${total} cars...`, progress: 0 });

        await API.Client.Cars.BulkCreateCars({ createUpdateCarDTO: cars });

        toast.update(toastId, { render: `${total} cars created!`, type: "success", isLoading: false, autoClose: 3000, progress: 1 });
        refresh();
      }}
    >
      Fill with 10 000 cars
    </button>
  );
} 