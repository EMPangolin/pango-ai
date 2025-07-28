import { CAVAX, ChainId, Currency, Token } from '@pangolindex/sdk';
import { useMemo } from 'react';
import AvaxLogo from '../../assets/images/avalanche_token_round.png';
//import EthLogo from '../../assets/images/Ethereum-logo-gray.png'
import { useActiveWeb3React } from '../../hooks';
import useHttpLocations from '../../hooks/useHttpLocations';
import { WrappedTokenInfo } from '../../state/lists/hooks';
import Logo from '../Logo';
import { getAddress } from 'ethers/lib/utils';
//import { AAVEe, CNR, DAIe, ELK, JOE, LINKe, QI, SUSHIe, USDCe, USDTe, WBTCe, WETHe, YAK } from '../../constants'

const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/pangolindex/tokens/main/assets/43114/${address}/logo_48.png`;

/*const getTokenLogoURLScroll = (address: string) =>
  `https://raw.githubusercontent.com/canarydeveloper/tokens/master/assets-scroll/${address}/logo.png`*/

export default function CurrencyLogo({
  currency,
  style,
}: {
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const { chainId } = useActiveWeb3React();
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined);

  const srcs: string[] = useMemo(() => {
    if (currency === CAVAX[chainId ?? ChainId.AVALANCHE]) return [];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [
          ...uriLocations,
          /*chainId == ChainId.SCROLL ? getTokenLogoURLScroll(currency.address) : */ getTokenLogoURL(getAddress(currency.address)),
        ];
      }

      return [
        ...uriLocations,
        /*chainId == ChainId.SCROLL ? getTokenLogoURLScroll(currency.address) : */ getTokenLogoURL(getAddress(currency.address)),
      ];
    }
    return [];
  }, [chainId, currency, uriLocations]);

  if (currency === CAVAX[ChainId.AVALANCHE]) {
    return <img src={AvaxLogo} className="size-6" style={style} />;
  }
  /*if (currency === CAVAX[ChainId.SCROLL]) {
    return <StyledEthereumLogo src={EthLogo} size={size} style={style} />
  }*/
  //console.log(currency?.symbol)
  return <Logo className="size-6 rounded-full" srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />;
}
