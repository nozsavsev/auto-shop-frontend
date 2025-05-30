import { IoChevronForward, IoChevronBack } from "react-icons/io5";

interface PaginationProps {
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
}

export default function Pagination({ pagination }: PaginationProps) {
  return (
    <div className="absolute left-1/2 bottom-2 -translate-x-1/2 z-20 bg-white/90 rounded-lg shadow-lg px-2 py-1 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 border border-gray-200 text-xs sm:text-sm">
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <label htmlFor="pageSize" className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
          Items per page:
        </label>
        <select
          id="pageSize"
          value={pagination.pageSize}
          onChange={(e) => {
            const newSize = parseInt(e.target.value);
            pagination.setPageSize(newSize);
            pagination.setPage(0);
          }}
          className="block w-12 sm:w-16 rounded-md border-0 py-1 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm flex-shrink-0"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
      <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
        <button
          onClick={() => pagination.setPage(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="relative inline-flex items-center px-2 py-1 text-gray-400 rounded-l-md border border-gray-300 bg-white text-xs sm:text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Previous</span>
          <IoChevronBack className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        {pagination.totalPages > 0 && (() => {
          const pages = [];
          const total = pagination.totalPages;
          const current = pagination.currentPage;
          if (total <= 5) {
            for (let i = 0; i < total; i++) {
              pages.push(i);
            }
          } else {
            pages.push(0);
            if (current > 2) pages.push("start-ellipsis");
            for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) {
              if (i !== 0 && i !== total - 1) pages.push(i);
            }
            if (current < total - 3) pages.push("end-ellipsis");
            pages.push(total - 1);
          }
          return pages.map((pageNum, idx) => {
            if (pageNum === "start-ellipsis" || pageNum === "end-ellipsis") {
              return (
                <span key={pageNum + idx} className="px-2 py-1 text-gray-400 select-none">
                  ...
                </span>
              );
            }
            return (
              <button
                key={pageNum}
                onClick={() => pagination.setPage(pageNum as number)}
                className={`relative inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium ${
                  pageNum === pagination.currentPage
                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                } border`}
              >
                {(pageNum as number) + 1}
              </button>
            );
          });
        })()}
        <button
          onClick={() => pagination.setPage(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="relative inline-flex items-center px-2 py-1 text-gray-400 rounded-r-md border border-gray-300 bg-white text-xs sm:text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="sr-only">Next</span>
          <IoChevronForward className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </nav>
    </div>
  );
} 