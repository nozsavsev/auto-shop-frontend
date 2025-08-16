import { useState, useCallback, useRef } from 'react';

interface UseSelectionOptions {
  allItems: { id?: number }[];
  currentPageItems: { id?: number }[];
}

export function useSelection({ allItems, currentPageItems }: UseSelectionOptions) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const lastSelectedIdRef = useRef<number | null>(null);

  const isSelected = useCallback((id: number) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  const isAllSelected = useCallback(() => {
    if (currentPageItems.length === 0) return false;
    return currentPageItems.every(item => item.id ? selectedIds.has(item.id) : false);
  }, [selectedIds, currentPageItems]);

  const isIndeterminate = useCallback(() => {
    if (currentPageItems.length === 0) return false;
    const selectedOnPage = currentPageItems.filter(item => item.id ? selectedIds.has(item.id) : false);
    return selectedOnPage.length > 0 && selectedOnPage.length < currentPageItems.length;
  }, [selectedIds, currentPageItems]);

  const selectAll = useCallback(() => {
    const newSelected = new Set(selectedIds);
    currentPageItems.forEach(item => {
      if (item.id) {
        newSelected.add(item.id);
      }
    });
    setSelectedIds(newSelected);
  }, [selectedIds, currentPageItems]);

  const deselectAll = useCallback(() => {
    const newSelected = new Set(selectedIds);
    currentPageItems.forEach(item => {
      if (item.id) {
        newSelected.delete(item.id);
      }
    });
    setSelectedIds(newSelected);
  }, [selectedIds, currentPageItems]);

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected()) {
      deselectAll();
    } else {
      selectAll();
    }
  }, [isAllSelected, selectAll, deselectAll]);

  const handleSelection = useCallback((id: number, selected: boolean, isShiftClick: boolean) => {
    setSelectedIds(prev => {
      const newSelected = new Set(prev);
      
      if (isShiftClick && lastSelectedIdRef.current && lastSelectedIdRef.current !== id) {
        // Range selection
        const lastIndex = currentPageItems.findIndex(item => item.id === lastSelectedIdRef.current);
        const currentIndex = currentPageItems.findIndex(item => item.id === id);
        
        if (lastIndex !== -1 && currentIndex !== -1) {
          const startIndex = Math.min(lastIndex, currentIndex);
          const endIndex = Math.max(lastIndex, currentIndex);
          
          for (let i = startIndex; i <= endIndex; i++) {
            const itemId = currentPageItems[i]?.id;
            if (itemId) {
              if (selected) {
                newSelected.add(itemId);
              } else {
                newSelected.delete(itemId);
              }
            }
          }
        }
      } else {
        // Single selection
        if (selected) {
          newSelected.add(id);
        } else {
          newSelected.delete(id);
        }
      }
      
      lastSelectedIdRef.current = id;
      return newSelected;
    });
  }, [currentPageItems]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    lastSelectedIdRef.current = null;
  }, []);

  const getSelectedCount = useCallback(() => {
    return selectedIds.size;
  }, [selectedIds]);

  const getVisibleSelectedCount = useCallback(() => {
    return currentPageItems.filter(item => item.id ? selectedIds.has(item.id) : false).length;
  }, [selectedIds, currentPageItems]);

  const getHiddenSelectedCount = useCallback(() => {
    return getSelectedCount() - getVisibleSelectedCount();
  }, [getSelectedCount, getVisibleSelectedCount]);

  const getSelectedItems = useCallback(() => {
    return allItems.filter(item => item.id ? selectedIds.has(item.id) : false);
  }, [allItems, selectedIds]);

  return {
    selectedIds: Array.from(selectedIds),
    isSelected,
    isAllSelected,
    isIndeterminate,
    handleSelection,
    toggleSelectAll,
    selectAll,
    deselectAll,
    clearSelection,
    getSelectedCount,
    getVisibleSelectedCount,
    getHiddenSelectedCount,
    getSelectedItems,
  };
}

