import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowLeft, Wallet } from 'lucide-react';

const HomeContent = ({ onGoToDashboard }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onGoToDashboard}
          className="text-white hover:bg-white/10 mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-white">Home</h1>
      </div>
      <Card className="glass-effect border-white/10">
        <CardContent className="p-8">
          <div className="text-center">
            <Wallet className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Budgify</h2>
            <p className="text-gray-300 mb-6">
              Your personal finance management hub. Track your income, expenses, and savings all in one place.
            </p>
            <Button 
              onClick={onGoToDashboard}
              className="bg-gradient-to-r from-blue-custom to-cyan-custom hover:from-blue-light hover:to-cyan-light"
            >
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeContent;
