import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/outline';

interface PriceTrendIndicatorProps {
  price: number;
  previousPrice?: number;
  className?: string;
}

const PriceTrendIndicator = ({ price, previousPrice, className = '' }: PriceTrendIndicatorProps) => {
  if (!previousPrice) {
    return null;
  }

  const difference = price - previousPrice;
  const percentageChange = (difference / previousPrice) * 100;
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  const getIcon = () => {
    if (isIncrease) return <ArrowTrendingUpIcon className="h-3 w-3 text-red-500" />;
    if (isDecrease) return <ArrowTrendingDownIcon className="h-3 w-3 text-green-500" />;
    return <MinusIcon className="h-3 w-3 text-gray-400" />;
  };

  const getColor = () => {
    if (isIncrease) return 'text-red-600';
    if (isDecrease) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className={`flex items-center space-x-1 text-xs ${className}`}>
      {getIcon()}
      <span className={getColor()}>
        {isIncrease ? '+' : ''}{Math.abs(percentageChange).toFixed(0)}%
      </span>
    </div>
  );
};

export default PriceTrendIndicator; 