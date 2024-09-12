import BigNumber from 'lib/bigNumberJs';
import { Box, Flex } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { useMkrDelegated } from 'modules/mkr/hooks/useMkrDelegated';
import { Delegate } from 'modules/delegates/types';
import { StatBox } from 'modules/app/components/StatBox';
import { useAccount } from 'modules/app/hooks/useAccount';
import { formatValue } from 'lib/string';
import Tooltip from 'modules/app/components/Tooltip';
import { getDescription } from 'modules/polling/components/VotingWeight';
import { useMKRVotingWeight } from 'modules/mkr/hooks/useMKRVotingWeight';
import Skeleton from 'react-loading-skeleton';

export function DelegateMKRDelegatedStats({
  delegate,
  delegatorCount
}: {
  delegate: Delegate;
  delegatorCount?: number;
}): React.ReactElement {
  const { account } = useAccount();
  // TODO: Fetch addresses suporting through API fetching

  const { data: mkrStaked } = useMkrDelegated(account, delegate.voteDelegateAddress);
  const { data: votingWeight } = useMKRVotingWeight(delegate.voteDelegateAddress);

  return (
    <Flex
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: ['column', 'row'],
        marginTop: 1,
        marginBottom: 1
      }}
    >
      <StatBox
        value={
          !votingWeight ? (
            <Skeleton width="100%" height="15px" />
          ) : votingWeight?.chiefBalanceHot ? (
            formatValue(votingWeight?.chiefBalanceHot)
          ) : (
            'Untracked'
          )
        }
        label={'Total GSUp Delegated'}
        tooltip={
          <Tooltip label={getDescription({ votingWeight, isDelegate: true })}>
            <Box>
              <Icon sx={{ ml: 1 }} name="question" />
            </Box>
          </Tooltip>
        }
      />
      <StatBox
        value={typeof delegatorCount !== 'undefined' ? new BigNumber(delegatorCount).toFormat(0) : '--'}
        label={'Total Active Delegators'}
      />
      {account && (
        <StatBox
          value={typeof mkrStaked !== 'undefined' ? formatValue(mkrStaked) : '0'}
          label={'GSUp delegated by you'}
        />
      )}
    </Flex>
  );
}
