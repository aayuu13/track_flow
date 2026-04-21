export const calculatePL = (transactions) => {
  let totalRevenue = 0;
  let totalCOGS = 0;
  let totalExpenses = 0;

  transactions.forEach((tx) => {
    if (tx.type === 'sales') {
      totalRevenue += tx.amount || 0;
      totalCOGS += (tx.costPrice || 0) * (tx.quantity || 0);
    } else if (tx.type === 'purchase') {
      totalCOGS += tx.amount || 0;
    } else if (tx.type === 'expense') {
      totalExpenses += tx.amount || 0;
    }
  });

  const grossProfit = totalRevenue - totalCOGS;
  const netProfit = grossProfit - totalExpenses;

  return {
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalCOGS: parseFloat(totalCOGS.toFixed(2)),
    grossProfit: parseFloat(grossProfit.toFixed(2)),
    totalExpenses: parseFloat(totalExpenses.toFixed(2)),
    netProfit: parseFloat(netProfit.toFixed(2)),
  };
};
