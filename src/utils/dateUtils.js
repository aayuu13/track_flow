export const formatDate = (date) => {
  if (!date) return '';
  if (date.toDate) {
    return date.toDate().toLocaleDateString('en-US');
  }
  return new Date(date).toLocaleDateString('en-US');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  if (date.toDate) {
    return date.toDate().toLocaleString('en-US');
  }
  return new Date(date).toLocaleString('en-US');
};

export const getDateRange = (days) => {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end };
};

export const filterByDateRange = (items, startDate, endDate) => {
  return items.filter((item) => {
    const itemDate = item.date?.toDate ? item.date.toDate() : new Date(item.date);
    return itemDate >= startDate && itemDate <= endDate;
  });
};
