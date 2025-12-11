import { StockLevel } from '../../domain/model/StockLevel';

interface StockLevelIndicatorProps {
  level: StockLevel;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const LEVEL_CONFIGS = {
  high: {
    percentage: 100,
    color: 'bg-green-500',
    label: 'High',
  },
  medium: {
    percentage: 50,
    color: 'bg-yellow-500',
    label: 'Medium',
  },
  low: {
    percentage: 25,
    color: 'bg-red-500',
    label: 'Low',
  },
  empty: {
    percentage: 0,
    color: 'bg-gray-300',
    label: 'Empty',
  },
};

const SIZE_CONFIGS = {
  small: {
    height: 'h-2',
    width: 'w-16',
  },
  medium: {
    height: 'h-3',
    width: 'w-24',
  },
  large: {
    height: 'h-4',
    width: 'w-32',
  },
};

export const StockLevelIndicator = ({ level, size = 'medium', showLabel = false }: StockLevelIndicatorProps) => {
  const config = LEVEL_CONFIGS[level.value as keyof typeof LEVEL_CONFIGS];
  const sizeConfig = SIZE_CONFIGS[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizeConfig.width} ${sizeConfig.height} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`absolute top-0 left-0 ${sizeConfig.height} ${config.color} transition-all duration-300`}
          style={{ width: `${config.percentage}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={config.percentage}
          aria-label={`Stock level: ${config.label}`}
        />
      </div>
      {showLabel && <span className="text-sm font-medium text-gray-700">{config.label}</span>}
    </div>
  );
};