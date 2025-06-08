import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import TransactionItem from './TransactionItem';

const RecentTransactions = ({ transactions }) => {
  return (
    <Card className="glass-effect border-white/10 ">
      <CardHeader>
        <CardTitle className="text-white flex flex-col lg:flex-row lg:items-center lg:justify-between text-lg lg:text-xl">
          Recent Transactions
          <Button variant="ghost" className="text-blue-light hover:bg-white/10 text-xs lg:text-sm mt-2 lg:mt-0">
            See More History
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 lg:space-y-4">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
