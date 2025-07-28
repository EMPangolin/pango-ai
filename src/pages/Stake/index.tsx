import { PageHeader } from '@/components/ui/page-header';
import { JSBI } from '@pangolindex/sdk';
import stakeImage from '../../assets/images/Stake22x.webp';
import { AutoColumn } from '../../components/Column';
import { Loader } from '@/components/ui/loader';
import PoolCardStakeV2 from '../../components/earn/PoolCardStakeV2';
import { useActiveWeb3React } from '../../hooks';
import { STAKING_REWARDS_INFO, StakingType, useStakingInfo } from '../../state/stake/hooksSingle';

export default function Stake() {
  const { chainId } = useActiveWeb3React();
  const stakingInfos = useStakingInfo(StakingType.SINGLE);
  const stakingRewardsExist = Boolean(typeof chainId === 'number' && (STAKING_REWARDS_INFO[chainId]?.length ?? 0) > 0);

  return (
    <>
      <PageHeader
        variant="stake"
        title="Pangolin Single Staking"
        description="Stake your PNG and earn more PNG! Also maximize your earnings with autocompound"
        image={stakeImage}
      />
      {!stakingRewardsExist
        ? 'No active rewards'
        : stakingInfos
            ?.sort(function (info_a, info_b) {
              if (info_a.stakedAmount.greaterThan(JSBI.BigInt(0))) {
                if (info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
                  // both are being staked, so we keep the previous sorting
                  return 0;
                // the second is actually not at stake, so we should bring the first up
                else return -1;
              } else {
                if (info_b.stakedAmount.greaterThan(JSBI.BigInt(0)))
                  // first is not being staked, but second is, so we should bring the first down
                  return 1;
                // none are being staked, let's keep the  previous sorting
                else return 0;
              }
            })
            .map(stakingInfo => {
              return <PoolCardStakeV2 key={stakingInfo.stakingRewardAddress} stakingInfo={stakingInfo} />;
            })}

      {stakingRewardsExist && stakingInfos?.length === 0 && (
        <>
          <AutoColumn gap="lg" style={{ width: '100%', maxWidth: '960px' }}>
            <Loader />
          </AutoColumn>
        </>
      )}
    </>
  );
}
