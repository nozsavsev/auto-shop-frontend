import { useState } from 'react';
import { FiTrash, FiX, FiAlertTriangle } from 'react-icons/fi';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-toastify';

interface BatchActionsProps {
  selectedCount: number;
  visibleSelectedCount: number;
  hiddenSelectedCount: number;
  onBatchDelete: () => Promise<void>;
  onClearSelection: () => void;
  itemType: 'user' | 'car';
}

export default function BatchActions({
  selectedCount,
  visibleSelectedCount,
  hiddenSelectedCount,
  onBatchDelete,
  onClearSelection,
  itemType
}: BatchActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (selectedCount === 0) return null;

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    const toastId = toast.loading(`Deleting ${selectedCount} ${itemType}${selectedCount !== 1 ? 's' : ''}...`);
    
    try {
      await onBatchDelete();
      toast.update(toastId, {
        render: `Successfully deleted ${selectedCount} ${itemType}${selectedCount !== 1 ? 's' : ''}`,
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      toast.update(toastId, {
        render: `Failed to delete ${itemType}s`,
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {selectedCount} {itemType}{selectedCount !== 1 ? 's' : ''} selected
            </span>
            
            {hiddenSelectedCount > 0 && (
              <div className="flex items-center gap-1 text-amber-600">
                <FiAlertTriangle className="w-4 h-4" />
                <span className="text-xs">
                  {hiddenSelectedCount} not visible
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              <FiTrash className="w-4 h-4" />
              Delete
            </button>
            
            <button
              onClick={onClearSelection}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FiTrash className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Delete {selectedCount} {itemType}{selectedCount !== 1 ? 's' : ''}
                </Dialog.Title>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            {hiddenSelectedCount > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-center gap-2 text-amber-800">
                  <FiAlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Warning</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  {hiddenSelectedCount} of the selected {itemType}s are not currently visible 
                  (may be on other pages or filtered out). They will also be deleted.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete {selectedCount} {itemType}{selectedCount !== 1 ? 's' : ''}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}