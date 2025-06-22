import { RxCross1 } from "react-icons/rx";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useEffect, useState } from "react";

export function SearchBar({ search, setSearch }: { search: string; setSearch: (search: string) => void }) {
  const [inputValue, setInputValue] = useState(search);
  const debouncedSearch = useDebounce(inputValue, 300); // 300ms delay

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  return (
    <div className="w-full sm:w-96 h-10 flex items-center rounded-lg border border-gray-200 bg-white">
      <input 
        type="text" 
        value={inputValue} 
        onChange={(e) => setInputValue(e.target.value)} 
        placeholder="Search" 
        className="w-full h-full outline-0 px-2 " 
      />
      <button 
        hidden={inputValue.length === 0} 
        onClick={() => {
          setInputValue("");
          setSearch("");
        }} 
        className="h-full px-2"
      >
        <RxCross1 className="text-gray-500" />
      </button>
    </div>
  );
}
  