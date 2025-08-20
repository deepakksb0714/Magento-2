import React, { useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTransactions as onGetTransactions } from '../../slices/thunk';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

interface Transaction {
  id: string;
  transaction_type: string;
  date: string;
  created_at: string;
  total_amount: string;
}

interface PaymentDataPoint {
  date: string;
  Income: number;
  Outcome: number;
  fullDate: Date;
}

interface PaymentActivityDataProps {
  className?: string;
  showIncome?: boolean;
  showOutcome?: boolean;
  timeFilter: '1W' | '1M' | '6M' | '1Y';
}

const selectTransactionList = createSelector(
  (state: any) => state.Invoice,
  (invoices: any) => ({
    transactionList: invoices.transactionList as Transaction[],
  })
);

const processTransactions = (transactions: Transaction[]) => {
  const transactionMap = new Map<string, { Income: number; Outcome: number }>();

  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const dateKey = date.toISOString().split('T')[0];
    const amount = parseFloat(transaction.total_amount);

    const existing = transactionMap.get(dateKey) || { Income: 0, Outcome: 0 };
    
    if (transaction.transaction_type.toLowerCase() === 'income') {
      existing.Income += amount;
    } else {
      existing.Outcome += amount;
    }

    transactionMap.set(dateKey, existing);
  });

  return Array.from(transactionMap.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([dateStr, values]) => ({
      date: dateStr, // Keep the full date string for now
      fullDate: new Date(dateStr),
      Income: Number((values.Income / 1000).toFixed(1)),
      Outcome: Number((values.Outcome / 1000).toFixed(1)),
    }));
};

const formatDate = (date: Date, timeFilter: '1W' | '1M' | '6M' | '1Y') => {
  if (timeFilter === '6M' || timeFilter === '1Y') {
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    return `${month}'${year}`;
  } else {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day}${month}`;
  }
};

const PaymentActivityData: React.FC<PaymentActivityDataProps> = ({
  className,
  showIncome = true,
  showOutcome = true,
  timeFilter,
}) => {
  const { transactionList } = useSelector(selectTransactionList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetTransactions());
  }, [dispatch]);

  useEffect(() => {
    if (!transactionList || transactionList.length === 0) {
      dispatch(onGetTransactions());
    }
  }, [dispatch, transactionList]);
  

  const { filteredData, labelData } = useMemo(() => {
    if (!transactionList?.length) {
      return { filteredData: [], labelData: [] };
    }

    const currentDate = new Date();
    let startDate: Date;
    let numberOfLabels: number;

    switch (timeFilter) {
      case '1W':
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 6); // Changed from -7 to -6 to include current day as 7th day
        numberOfLabels = 7;
        break;
      case '1M':
        startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() - 1);
        numberOfLabels = 30; // Changed from 15 to 30 to show all days
        break;
      case '6M':
        startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() - 6);
        // Do not change the day anymore - we want the same day across 6 months
        numberOfLabels = 6;
        break;
      case '1Y':
        startDate = new Date(currentDate);
        startDate.setFullYear(currentDate.getFullYear() - 1);
        // Similarly for 1Y, keep the same day of the month
        numberOfLabels = 12;
        break;
      default:
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 6);
        numberOfLabels = 7;
    }

    const processedData = processTransactions(transactionList);
    const filteredFullData = processedData.filter(
      (item) => item.fullDate >= startDate && item.fullDate <= currentDate
    );

    // Handle monthly data (6M and 1Y filters)
    if (timeFilter === '6M' || timeFilter === '1Y') {
      // For 6M and 1Y filter, create data points for each month with the same day as current date
      const monthlyDataPoints: PaymentDataPoint[] = [];
      const months = timeFilter === '6M' ? 6 : 12;
      const currentDay = currentDate.getDate();
      
      for (let i = 0; i < months; i++) {
        const monthDate = new Date(currentDate);
        monthDate.setMonth(currentDate.getMonth() - (months - 1 - i));
        
        // Ensure we're using the same day of month (or last day if month is shorter)
        const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
        monthDate.setDate(Math.min(currentDay, daysInMonth));
        
        const monthStr = formatDate(monthDate, timeFilter);
        
        // Get all transactions for this month
        const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        
        const monthTransactions = filteredFullData.filter(
          item => item.fullDate >= monthStart && item.fullDate <= monthEnd
        );
        
        // Sum up the transactions for the month
        const income = monthTransactions.reduce((sum, curr) => sum + curr.Income, 0);
        const outcome = monthTransactions.reduce((sum, curr) => sum + curr.Outcome, 0);
        
        monthlyDataPoints.push({
          date: monthStr,
          fullDate: monthDate,
          Income: income,
          Outcome: outcome
        });
      }

      return {
        filteredData: monthlyDataPoints,
        labelData: monthlyDataPoints,
      };
    }

    // Handle 1W filter - ensure we have all 7 days
    if (timeFilter === '1W') {
      // Create array with all 7 days (even if there's no data)
      const allDays: PaymentDataPoint[] = [];
      for (let i = 0; i <= 6; i++) {  // 0 to 6 = 7 days
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - (6 - i)); // Count backwards from current date
        
        const dateStr = date.toISOString().split('T')[0];
        const formattedDate = formatDate(date, timeFilter);
        
        // Find if we have data for this day
        const existingData = filteredFullData.find(
          item => item.fullDate.toISOString().split('T')[0] === dateStr
        );
        
        allDays.push({
          date: formattedDate,
          fullDate: date,
          Income: existingData ? existingData.Income : 0,
          Outcome: existingData ? existingData.Outcome : 0
        });
      }
      
      return {
        filteredData: allDays,
        labelData: allDays,
      };
    }

    // Handle 1M filter - show all 30 days
    if (timeFilter === '1M') {
      const allDays: PaymentDataPoint[] = [];
      // Loop through all 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - (29 - i)); // Count from 29 days ago to today
        
        const dateStr = date.toISOString().split('T')[0];
        const formattedDate = formatDate(date, timeFilter);
        
        // Find if we have data for this day
        const existingData = filteredFullData.find(
          item => item.fullDate.toISOString().split('T')[0] === dateStr
        );
        
        allDays.push({
          date: formattedDate,
          fullDate: date,
          Income: existingData ? existingData.Income : 0,
          Outcome: existingData ? existingData.Outcome : 0
        });
      }
      
      return {
        filteredData: allDays,
        labelData: allDays,
      };
    }

    // This section won't be reached for 1M anymore, but keeping for safety
    const formattedData = filteredFullData.map(item => ({
      ...item,
      date: formatDate(item.fullDate, timeFilter)
    }));

    const step = Math.max(1, Math.floor(formattedData.length / (numberOfLabels - 1)));
    const labelPoints = [];
    
    for (let i = 0; i < formattedData.length; i += step) {
      if (labelPoints.length < numberOfLabels) {
        labelPoints.push(formattedData[i]);
      }
    }

    if (labelPoints.length < numberOfLabels && formattedData.length > 0) {
      const lastPoint = formattedData[formattedData.length - 1];
      if (!labelPoints.includes(lastPoint)) {
        labelPoints.push(lastPoint);
      }
    }

    return {
      filteredData: formattedData,
      labelData: labelPoints,
    };
  }, [transactionList, timeFilter]);

  return (
    <div className={className} style={{ height: '300px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" horizontal={true} vertical={false} />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#71717A', fontSize: 12 }}
            ticks={labelData.map(item => item.date)}
            interval={timeFilter === '1M' ? 2 : 0} // Show every 3rd label for 1M to avoid crowding
            padding={{ left: 30, right: 30 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 12 }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `${value}K`}
          />
          <Tooltip />
          {/* {showIncome && <Line type="monotone" dataKey="Income" stroke="#4ade80" strokeWidth={3} dot={false} />} */}
          {showOutcome && <Line type="monotone" dataKey="Outcome" stroke="#9e8ef6" strokeWidth={3} dot={false} />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PaymentActivityData;