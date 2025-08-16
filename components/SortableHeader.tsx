import { IoChevronUp, IoChevronDown } from 'react-icons/io5';

export type SortDirection = 'asc' | 'desc' | null;

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSortKey: string | null;
  currentDirection: SortDirection;
  onSort: (key: string, direction: SortDirection) => void;
  className?: string;
  disabled?: boolean;
}

export default function SortableHeader({
  label,
  sortKey,
  currentSortKey,
  currentDirection,
  onSort,
  className = '',
  disabled = false
}: SortableHeaderProps) {
  const isActive = currentSortKey === sortKey;

  const handleClick = () => {
    if (disabled) return;
    if (!isActive || currentDirection === 'desc') {
      onSort(sortKey, 'asc');
    } else if (currentDirection === 'asc') {
      onSort(sortKey, 'desc');
    } 
  };

  return (
    <th
      className={`font-semibold px-4 py-3 bg-white text-left cursor-pointer hover:bg-gray-50 select-none ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-gray-500 font-medium">
          {label}
        </span>
        <div className={`flex flex-col ${disabled ? 'hidden' : ''}`}>
          <IoChevronUp
            className={`w-3 h-3 ${isActive && currentDirection === 'asc'
                ? 'text-blue-600'
                : 'text-gray-300'
              }`}
          />
          <IoChevronDown
            className={`w-3 h-3 -mt-1 ${isActive && currentDirection === 'desc'
                ? 'text-blue-600'
                : 'text-gray-300'
              }`}
          />
        </div>
      </div>
    </th>
  );
}

