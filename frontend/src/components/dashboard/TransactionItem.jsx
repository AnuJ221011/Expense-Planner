import {
  TrendingUp,
  PiggyBank,
  ShoppingCart,
  Calendar,
  Clock
} from 'lucide-react';

const TransactionItem = ({ transaction }) => {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'income':
        return <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4" />;
      case 'saving':
        return <PiggyBank className="h-3 w-3 lg:h-4 lg:w-4" />;
      case 'expense':
        return <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4" />;
      default:
        return <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4" />;
    }
  };

  const getTransactionColor = () => {
    switch (transaction.type) {
      case 'income':
        return 'bg-green-400/20 text-green-400';
      case 'saving':
        return 'bg-blue-400/20 text-blue-400';
      case 'expense':
        return 'bg-red-400/20 text-red-400';
      default:
        return 'bg-red-400/20 text-red-400';
    }
  };

  const getAmountColor = () => {
    switch (transaction.type) {
      case 'income':
        return 'text-green-400';
      case 'saving':
        return 'text-blue-400';
      case 'expense':
        return 'text-red-400';
      default:
        return 'text-red-400';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 lg:p-4 bg-white/5 rounded-lg">
      <div className="flex items-center space-x-3 lg:space-x-4">
        <div className={`p-2 rounded-full ${getTransactionColor()}`}>
          {getTransactionIcon()}
        </div>
        <div>
          <p className="text-white font-medium text-sm lg:text-base">{transaction.entity}</p>
          <p className="text-gray-400 text-xs lg:text-sm">{transaction.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold text-sm lg:text-base ${getAmountColor()}`}>
          {transaction.type === 'expense' ? '-' : '+'}${transaction.amount.toLocaleString()}
        </p>
        <p className="text-gray-400 text-xs flex items-center">
          <Calendar className="h-2 w-2 lg:h-3 lg:w-3 mr-1" />
          {transaction.date}
          <Clock className="h-2 w-2 lg:h-3 lg:w-3 ml-2 mr-1" />
          {transaction.time}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
