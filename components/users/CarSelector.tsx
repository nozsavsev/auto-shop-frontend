import { useState, useEffect, useCallback } from "react";
import { Field, useFormikContext } from "formik";
import { CarDTO } from "@/src/API/AutoShopApi";
import { useCars } from "@/src/hooks/useCars";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoCar, IoSearch, IoClose } from "react-icons/io5";
import { AiOutlineLoading } from "react-icons/ai";
import { useOutsideClick } from "@/src/hooks/useOutsideClick";

interface CarSelectorProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
}

export default function CarSelector({ name, label, placeholder = "Search cars...", className = "" }: CarSelectorProps) {
  const { values, setFieldValue } = useFormikContext<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCar, setSelectedCar] = useState<CarDTO | null>(null);
  
  const { outsideClickRef } = useOutsideClick<HTMLDivElement>(() => setIsOpen(false));

  // Initialize cars hook for infinite scroll
  const carsHook = useCars({
    initialPage: 0,
    initialPageSize: 20,
    textMatch: searchTerm || undefined,
    initialData: undefined,
  });

  // Load more cars when scrolling
  const loadMore = useCallback(() => {
    if (carsHook.pagination.hasNextPage) {
      carsHook.pagination.setPage(carsHook.pagination.currentPage + 1);
    }
  }, [carsHook.pagination]);

  // Update search when searchTerm changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carsHook.pagination.setPage(0); // Reset to first page
      carsHook.refresh();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, carsHook]);

  // Set selected car when value changes
  useEffect(() => {
    const carId = values[name];
    if (carId && carsHook.cars.length > 0) {
      const car = carsHook.cars.find(c => c.id === carId);
      if (car) {
        setSelectedCar(car);
      }
    } else if (!carId) {
      setSelectedCar(null);
    }
  }, [values[name], carsHook.cars, name]);

  const handleCarSelect = (car: CarDTO) => {
    setSelectedCar(car);
    setFieldValue(name, car.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClearSelection = () => {
    setSelectedCar(null);
    setFieldValue(name, null);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      carsHook.pagination.setPage(0);
      carsHook.refresh();
    }
  };

  return (
    <div ref={outsideClickRef} className={`relative ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={handleToggleDropdown}
          className="w-full px-3 py-2 text-left border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {selectedCar ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IoCar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-900">
                  {selectedCar.company} {selectedCar.model}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSelection();
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <IoClose className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
            {/* Search input */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Cars list with infinite scroll */}
            <div className="max-h-60 overflow-y-auto">
              <InfiniteScroll
                dataLength={carsHook.cars.length}
                next={loadMore}
                hasMore={carsHook.pagination.hasNextPage}
                loader={
                  <div className="flex justify-center py-4">
                    <AiOutlineLoading className="w-5 h-5 text-blue-600 animate-spin" />
                  </div>
                }
                endMessage={
                  <div className="text-center py-4 text-gray-500 text-sm">
                    {carsHook.cars.length === 0 ? "No cars found" : "No more cars to load"}
                  </div>
                }
              >
                {carsHook.cars.map((car) => (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => handleCarSelect(car)}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <IoCar className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">
                        {car.company} {car.model}
                      </span>
                    </div>
                  </button>
                ))}
              </InfiniteScroll>
            </div>

            {/* Loading state */}
            {carsHook.isLoading && carsHook.cars.length === 0 && (
              <div className="flex justify-center py-4">
                <AiOutlineLoading className="w-5 h-5 text-blue-600 animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!carsHook.isLoading && carsHook.cars.length === 0 && searchTerm && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No cars found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden field for Formik */}
      <Field type="hidden" name={name} />
    </div>
  );
}
