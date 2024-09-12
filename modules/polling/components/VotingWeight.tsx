import { Box, Flex, Text } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import Tooltip from 'modules/app/components/Tooltip';
import { MKRVotingWeightResponse } from 'modules/mkr/helpers/getMKRVotingWeight';
import { getPollingVotingWeightCopy } from 'modules/polling/helpers/getPollingVotingWeightCopy';
import { useAccount } from 'modules/app/hooks/useAccount';
import { useMKRVotingWeight } from 'modules/mkr/hooks/useMKRVotingWeight';
import { formatValue } from 'lib/string';

export const getDescription = ({
  votingWeight,
  isDelegate
}: {
  votingWeight?: MKRVotingWeightResponse;
  isDelegate?: boolean;
}): JSX.Element | null => {
  if (votingWeight) {
    if (isDelegate) {
      return (
        <Text as="p">
          {'Balance of delegated GSUp: ' + formatValue(votingWeight.chiefBalanceHot) + ' GSUp'}
        </Text>
      );
    } else if (
      votingWeight.chiefBalanceProxy &&
      votingWeight.chiefBalanceCold &&
      votingWeight.walletBalanceCold
    ) {
      return (
        <>
          <Text as="p">
            {'Proxy balance in chief: ' + formatValue(votingWeight.chiefBalanceProxy) + ' GSUp'}
          </Text>
          <Text as="p">{'Hot balance in chief: ' + formatValue(votingWeight.chiefBalanceHot) + ' GSUp'}</Text>
          <Text as="p">
            {'Hot balance in wallet: ' + formatValue(votingWeight.walletBalanceHot) + ' GSUp'}
          </Text>
          <Text as="p">
            {'Cold balance in chief: ' + formatValue(votingWeight.chiefBalanceCold) + ' GSUp'}
          </Text>
          <Text as="p">
            {'Cold balance in wallet: ' + formatValue(votingWeight.walletBalanceCold) + ' GSUp'}
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text as="p">{'Balance in chief: ' + formatValue(votingWeight.chiefBalanceHot) + ' GSUp'}</Text>
          <Text as="p">{'Balance in wallet: ' + formatValue(votingWeight.walletBalanceHot) + ' GSUp'}</Text>
        </>
      );
    }
  }

  return null;
};

export default function VotingWeight(): JSX.Element {
  const { account, voteDelegateContractAddress } = useAccount();

  const { data: votingWeight } = useMKRVotingWeight(account);

  const votingWeightCopy = getPollingVotingWeightCopy(!!voteDelegateContractAddress);

  const tooltipLabel = (
    <Box>
      <Text as="p" sx={{ whiteSpace: 'normal' }}>
        {votingWeightCopy}
      </Text>
      {getDescription({ votingWeight, isDelegate: !!voteDelegateContractAddress })}
    </Box>
  );

  return (
    <Flex
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
      }}
    >
      <Flex sx={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text as="p" color="textSecondary">
          Voting weight
        </Text>
        <Tooltip label={tooltipLabel}>
          <Box>
            <Icon name="question" ml={2} mt={'6px'} />
          </Box>
        </Tooltip>
      </Flex>
      <Text sx={{ color: 'text' }}>{votingWeight ? `${formatValue(votingWeight.total)} GSUp` : '--'}</Text>
    </Flex>
  );
}
