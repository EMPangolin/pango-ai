import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { usePoolDatasN } from '@/data/pools/poolDataN';
import { calcAPR, calcTVL, calcVolume } from '@/hooks/usePoolMetrics';
import { useUSDCPrice } from '@/hooks/useUSDCPrice/evm';
import { useChainId } from '@/provider';
import { useUnderlyingTokens } from '@/hooks/evm';
import { unwrappedTokenV3 } from '@/utils/wrappedCurrency';
import { Currency, ElixirPool, FeeAmount, Token } from '@pangolindex/sdk';
import { FC, useEffect } from 'react';
import { getTokenLogoURL } from '../CurrencyLogoV3/getTokenLogoURL';
import { DoubleCurrencyLogoV2 } from '../DoubleLogoNew';
import { formatDollarAmount } from '@/utils/numbers';
import './NeonBonusRewards.css';
import { PoolDataV2 } from '@/state/pools/reducer';
import { useAllTokenData, useTokenData } from '@/state/tokens/hooks';
import ReactTooltip from 'react-tooltip';

interface PoolRowProps {
  pool: PoolDataV2;
}

export const PoolRowV2: FC<PoolRowProps> = ({ pool }) => {

  const chainId = useChainId();

  const currency0 = pool?.token0 ? unwrappedTokenV3(pool.token0 as Token, chainId) : undefined;
  const currency1 = pool?.token1 ? unwrappedTokenV3(pool.token1 as Token, chainId) : undefined;

  const apr = calcAPR(pool?.oneDayVolumeUSD, pool?.oneDayVolumeUSD, pool?.reserveUSD, 3000);
  
  const formattedTVL = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pool.reserveUSD);

  const formattedVLM = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pool.oneDayVolumeUSD);

  return (
    <div className="mb-4 border p-4 rounded-md flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
      <div className="flex items-center gap-2 lg:w-1/4">
        <DoubleCurrencyLogoV2 currency0={currency0} currency1={currency1} size={32} />
        <h5>
          {currency0?.symbol}-{currency1?.symbol}
        </h5>
      </div>
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-5 lg:w-3/4">
        <div>
          <span className="text-slate-400 lg:hidden">Fee</span>
          <h5 className="lg:text-center">0.3%</h5>
        </div>
        <div>
          <span className="text-slate-400 lg:hidden">APR</span>
          <h5 className="lg:text-center">{apr.toFixed(2)}%</h5>
        </div>
        <div>
          <span className="text-slate-400 lg:hidden">TVL</span>
          <h5 className="lg:text-center">{formattedTVL}</h5>
        </div>
        <div>
          <span className="text-slate-400 lg:hidden">Volume 24H</span>
          <h5 className="lg:text-center">{formattedVLM}</h5>
        </div>
        <div>
          <span className="text-slate-400 lg:hidden">Pool Type</span>
          <h5 className="lg:text-center">v2</h5>
        </div>
      </div>
      <div className="lg:w-[160px]">
        <Button>
          <Icons.plus className="mr-2 size-4" />
          Add Liquidity
        </Button>
      </div>
    </div>
  );
};