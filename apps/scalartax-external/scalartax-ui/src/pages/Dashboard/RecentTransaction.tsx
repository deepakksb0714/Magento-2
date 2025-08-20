import React, { useEffect, useState } from 'react';
import { Card, Col, Dropdown } from 'react-bootstrap';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions as onGetTransactions } from '../../slices/thunk';

interface Transaction {
  id: string;
  transaction_type: string;
  date: string;
  created_at: string;
  total_amount: string;
}

interface GroupedTransaction {
  day: string;
  transactionDetails: Transaction[];
}

type FilterType = 'yearly' | 'monthly' | 'weekly' | 'today' | 'all';

const RecentTransaction = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const selectTransactionList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      transactionList: invoices.transactionList as Transaction[],
    })
  );

  const { transactionList } = useSelector(selectTransactionList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetTransactions());
  }, [dispatch]);

  const filterTransactions = (transactions: Transaction[] | undefined): Transaction[] => {
    if (!transactions) return [];
    
    const now = new Date();
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      switch (activeFilter) {
        case 'today':
          return (
            transactionDate.getDate() === now.getDate() &&
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
          
        case 'weekly':
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          return transactionDate >= oneWeekAgo;
          
        case 'monthly':
          return (
            transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear()
          );
          
        case 'yearly':
          return transactionDate.getFullYear() === now.getFullYear();
          
        default:
          return true;
      }
    });
    
    return filteredTransactions;
  };

  const groupTransactionsByDate = (transactions: Transaction[] | undefined): GroupedTransaction[] => {
    if (!transactions) return [];

    const filtered = filterTransactions(transactions);
    
    const grouped = filtered.reduce((acc: { [key: string]: Transaction[] }, transaction: Transaction) => {
      const date = new Date(transaction.date);
      const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      acc[dateStr].push(transaction);
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, transactions]) => ({
      day: date,
      transactionDetails: transactions,
    }));
  };

  const getBadgeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'purchase invoice':
        return 'badge-soft-danger';
      case 'sales invoice':
        return 'badge-soft-success';
      default:
        return 'badge-soft-warning';
    }
  };

  const getTransactionIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'purchase invoice':
        return 'las la-arrow-down';
      case 'sales invoice':
        return 'las la-arrow-up';
      default:
        return 'las la-exchange-alt';
    }
  };

  const groupedTransactions = groupTransactionsByDate(transactionList);

  return (
    <React.Fragment>
      <Col xl={6}>
        <Card className="h-100">
          <Card.Body className="d-flex flex-column h-100">
            <div className="d-flex align-items-start mb-3">
              <div className="flex-grow-1">
                <h5 className="card-title">Recent Transactions</h5>
              </div>
              <div className="flex-shrink-0">
                <Dropdown>
                  <Dropdown.Toggle className="text-muted arrow-none" as="a">
                    <i className="las la-ellipsis-h fs-20"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-end">
                    <Dropdown.Item onClick={() => setActiveFilter('yearly')}>Yearly</Dropdown.Item>
                    <Dropdown.Item onClick={() => setActiveFilter('monthly')}>Monthly</Dropdown.Item>
                    <Dropdown.Item onClick={() => setActiveFilter('weekly')}>Weekly</Dropdown.Item>
                    <Dropdown.Item onClick={() => setActiveFilter('today')}>Today</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <div 
              className="transactions-container flex-grow-1"
              style={{
                overflowY: 'auto',
                overflowX: 'hidden',
                height: '100%',
                maxHeight: '418px',
                paddingRight: '8px',
                marginRight: '-8px'
              }}
            >
              {groupedTransactions.length > 0 ? (
                groupedTransactions.map((group: GroupedTransaction, groupIndex: number) => (
                  <div key={groupIndex} className="mb-3">
                    <p className="text-muted mb-2">{group.day}</p>
                    {group.transactionDetails.map((transaction: Transaction) => (
                      <div
                        className="border-bottom sales-history mb-3"
                        key={transaction.id}
                      >
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm flex-shrink-0">
                            <span className="avatar-title bg-primary rounded-circle fs-3">
                              <i className={`${getTransactionIcon(transaction.transaction_type)} fs-22`}></i>
                            </span>
                          </div>
                          <div className="flex-grow-1 ms-3 overflow-hidden">
                            <h5 className="fs-15 mb-1 text-truncate">
                              {transaction.transaction_type}
                            </h5>
                            <p className="fs-14 text-muted text-truncate mb-0">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`badge fs-12 ${getBadgeColor(transaction.transaction_type)}`}>
                              ${transaction.total_amount}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No transactions found for this time period</p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default RecentTransaction;