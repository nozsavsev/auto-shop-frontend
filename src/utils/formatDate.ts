export const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Use a consistent format that works the same on server and client
    return dateObj.toISOString().replace('T', ' ').substring(0, 19);
  };