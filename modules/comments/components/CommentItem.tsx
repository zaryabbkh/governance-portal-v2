import React from 'react';
import { Flex, Text, Box } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { formatDateWithTime } from 'lib/datetime';
import { useWeb3 } from 'modules/web3/hooks/useWeb3';
import DelegateAvatarName from 'modules/delegates/components/DelegateAvatarName';
import AddressIconBox from 'modules/address/components/AddressIconBox';
import { ParsedExecutiveComments, PollCommentsAPIResponseItemWithWeight } from '../types/comments';
import { getEtherscanLink } from 'modules/web3/helpers/getEtherscanLink';
import { InternalLink } from 'modules/app/components/InternalLink';
import { ExternalLink } from 'modules/app/components/ExternalLink';
import { formatValue } from 'lib/string';
import { parseUnits } from 'ethers/lib/utils';

export default function CommentItem({
  comment,
  votedOption
}: {
  comment: PollCommentsAPIResponseItemWithWeight | ParsedExecutiveComments;
  votedOption?: React.ReactNode;
}): React.ReactElement {
  const { network } = useWeb3();

  return (
    <Box>
      <Flex
        sx={{
          alignItems: ['flex-start', 'center'],
          justifyContent: 'space-between',
          flexDirection: ['column', 'row'],
          mb: 2,
          opacity: comment.completed ? 1 : 0.5
        }}
      >
        <Box>
          {comment.address && (
            <Box>
              {comment.address.isDelegate && comment.address.delegateInfo ? (
                <DelegateAvatarName delegate={comment.address.delegateInfo} />
              ) : (
                <Box>
                  <InternalLink href={`/address/${comment.address.address}`} title="Profile details">
                    <AddressIconBox address={comment.address.address} showExternalLink={false} />
                  </InternalLink>
                </Box>
              )}
            </Box>
          )}
        </Box>
        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: ['flex-start', 'flex-end'],
            maxWidth: ['100%', '265px'],
            textAlign: ['left', 'right']
          }}
        >
          <Text as="p" variant="caps" sx={{ lineHeight: '22px' }}>
            {formatDateWithTime(comment.comment.date)}
          </Text>
          <Text variant="smallCaps">
            {votedOption
              ? votedOption
              : `Voted with ${formatValue(
                  comment.comment.voterWeight,
                  undefined,
                  undefined,
                  true,
                  true
                )} GSUp`}
          </Text>

          {comment.comment.txHash && (
            <Box>
              <ExternalLink
                href={getEtherscanLink(network, comment.comment.txHash, 'transaction')}
                styles={{ my: 3 }}
                title="View on etherscan"
              >
                <Text sx={{ textAlign: 'center', fontSize: 14, color: 'accentBlue' }}>
                  View on Etherscan {!comment.completed ? '(Pending)' : ''}
                  <Icon name="arrowTopRight" pt={2} color="accentBlue" />
                </Text>
              </ExternalLink>
            </Box>
          )}
        </Flex>
      </Flex>

      <Text
        mt={2}
        variant="text"
        color="secondaryEmphasis"
        sx={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
        dangerouslySetInnerHTML={{ __html: comment.comment.comment }}
      ></Text>
    </Box>
  );
}
