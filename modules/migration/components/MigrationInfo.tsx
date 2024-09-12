import { useState } from 'react';
import { Flex, Text, Label, Checkbox, Button, Box } from 'theme-ui';
import { CircleIcon } from 'modules/app/components/CircleIcon';
import { ExternalLink } from 'modules/app/components/ExternalLink';

export function MigrationInfo({
  setMigrationInfoAcknowledged
}: {
  setMigrationInfoAcknowledged: (bool: boolean) => void;
}): JSX.Element {
  const [checked, setChecked] = useState(false);

  const handleChecked = () => setChecked(!checked);
  const handleContinue = () => setMigrationInfoAcknowledged(true);

  return (
    <Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Text as="p" variant="secondary">
          GSU protocol delegate contracts are{' '}
          <ExternalLink
            href="https://manual.gsuprotocol.io/delegation/delegate-expiration 
"
            title="Delegate expiration information"
          >
            <Text variant="secondary" sx={{ color: 'accentBlue' }}>
              designed to expire annually
            </Text>
          </ExternalLink>{' '}
          in order to protect the GSU protocol against stale GSUp tokens participating in GSU protocol
          governance.
        </Text>

        <Text as="p" variant="secondary" sx={{ mt: 3 }}>
          Complete the migration flow to create a new delegate contract and establish a link between the old
          and new contract, in order to preserve your voting history & delegate metrics in the Voting Portal.{' '}
        </Text>

        <Text as="p" variant="secondary" sx={{ mt: 3 }}>
          Completing the migration will also assist your delegators in migrating their GSUp to your new
          delegate contract address. Migration is not supported for Shadow Delegates, only for Recognized
          Delegates.
        </Text>
        <Text as="h3" variant="smallHeading" sx={{ my: 4 }}>
          Before starting the flow, please consider the following notice:
        </Text>
        <Flex sx={{ flexDirection: 'column', maxWidth: '620px', alignSelf: 'center' }}>
          <Flex>
            <Box sx={{ width: '30%' }}>
              <CircleIcon name="hourglass" iconColor="onSurface" borderColor="secondary" />
            </Box>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text as="h3" variant="microHeading">
                Finalize your migration asap to keep the Protocol secure
              </Text>
              <Text as="p" variant="secondary" sx={{ mt: 2 }}>
                Please finalize your migration as soon as possible so that your delegators can swiftly migrate
                their GSUp, minimizing risk of governance attacks.
              </Text>
            </Flex>
          </Flex>
          <Flex sx={{ mt: 3 }}>
            <Box sx={{ width: '30%' }}>
              <CircleIcon name="wallet" iconColor="onSurface" borderColor="secondary" iconSize={15} />
            </Box>
            <Flex sx={{ flexDirection: 'column' }}>
              <Text as="h3" variant="microHeading">
                You need to use a different wallet address for generating your new delegate contract
              </Text>
              <Text as="p" variant="secondary" sx={{ mt: 2 }}>
                Make sure the address you enter in the next step is different from the currently connected
                address, and make sure you are the sole operator of the address.
              </Text>
            </Flex>
          </Flex>
          <Label sx={{ mt: 3, fontSize: 2, alignItems: 'center' }}>
            <Checkbox checked={checked} onChange={handleChecked} />I understand
          </Label>
          <Button disabled={!checked} onClick={handleContinue} sx={{ mt: 3 }}>
            Start Migration
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
