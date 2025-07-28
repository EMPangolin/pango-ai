import { Currency } from '@pangolindex/sdk';
import React, { useCallback } from 'react';
import { Balance, CurrencyRoot } from './styled';
import { useChainId, usePangolinWeb3 } from '@/provider';
import CurrencyLogo from '@/components/CurrencyLogo';
import { Text } from '@/components/TextV3';
import { LoaderIcon } from 'lucide-react';
import { useCurrencyBalanceV3 } from '@/state/wallet/hooks';
import { Button } from '@/components/ui/button';
import { useActiveWeb3React } from '@/hooks';
import Loader from '@/components/Loader';

interface Props {
  currency: Currency;
  onSelect: (currency: Currency) => void;
  isSelected: boolean;
  otherSelected: boolean;
}

const CurrencyGrid1 = ({ currency, onSelect, isSelected }: Props) => {
  const { account } = usePangolinWeb3();
  const chainId = useChainId();
  const balance = useCurrencyBalanceV3(chainId, account ?? undefined, currency);

  const handleSelect = useCallback(() => {
    onSelect(currency);
  }, [onSelect, currency]);

  return (
    <Button
      block
      className="flex h-auto flex-col items-center justify-center"
      onClick={handleSelect}
      disabled={isSelected}
    >
      <CurrencyLogo currency={currency} />
      <p className="!m-0 font-semibold">{currency?.symbol}</p>
      <small>{balance ? balance.toSignificant(4) : account ? <LoaderIcon /> : '-'}</small>
    </Button>
  );
};

const CurrencyGrid: React.FC<Props> = (props) => {
  const { currency, style, onSelect, isSelected, otherSelected } = props;
  const { account } = useActiveWeb3React();
  const chainId = useChainId();

  const balance = useCurrencyBalanceV3(chainId, account ?? undefined, currency);

  const handleSelect = useCallback(() => {
    onSelect(currency);
  }, [onSelect, currency]);

  return (
    <CurrencyRoot style={style} onClick={handleSelect} disabled={isSelected} selected={otherSelected}>
      <CurrencyLogo currency={currency} size={24} imageSize={48} />
      <Text
        color="swapWidget.primary"
        fontSize={14}
        title={currency?.name}
        fontWeight={500}
        marginBottom="10px"
        marginTop="5px"
      >
        {currency?.symbol}
      </Text>
      <Balance color="swapWidget.primary" fontSize={14}>
        {balance ? balance.toSignificant(4) : account ? <Loader /> : null}
      </Balance>
    </CurrencyRoot>
  );
};

export default CurrencyGrid;
