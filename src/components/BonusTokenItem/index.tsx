import React from 'react';
import { useSingleCallResult } from '@/state/multicallv3/hooks';
import { getTokenLogoURL } from '@/components/CurrencyLogoV3/getTokenLogoURL';
import { useTokenContract } from '@/hooks/useContract';

interface BonusTokenItemProps {
  address: string;
  rewardValue?: number;
  chainId: number;
}

const BonusTokenItem: React.FC<BonusTokenItemProps> = ({ address, rewardValue, chainId }) => {
  const tokenContract = useTokenContract(address);
  const tokenSymbol = useSingleCallResult(tokenContract, 'symbol').result;
  const tokenDecimals = useSingleCallResult(tokenContract, 'decimals').result;

  const userBalance = rewardValue && tokenDecimals
    ? Number(rewardValue) / (10 ** Number(tokenDecimals))
    : 0;

  const logoUrl = getTokenLogoURL(address, chainId, 24);

  return (
    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <img src={logoUrl} alt="token logo" />
        {tokenSymbol || '-'}
      </div>
      {userBalance.toFixed(4)}
    </div>
  );
};

export default BonusTokenItem;
