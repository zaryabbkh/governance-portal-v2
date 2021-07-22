import { configure, act, fireEvent, screen, cleanup } from '@testing-library/react';
import mixpanel from 'mixpanel-browser';
import { SWRConfig } from 'swr';
import getMaker from '../../lib/maker';
import {
  injectProvider,
  connectAccount,
  renderWithAccountSelect as render,
  createDelegate,
  switchAccount,
  DEMO_ACCOUNT_TESTS
} from '../helpers';
import { ExecutiveOverview } from '../../pages/executive';
import proposals from '../../mocks/proposals.json';
import { accountsApi } from 'stores/accounts';

jest.mock('@theme-ui/match-media', () => {
  return {
    useBreakpointIndex: jest.fn(() => 3)
  };
});

const { click } = fireEvent;
let maker;

async function setup() {
  const view = render(
    <SWRConfig value={{ dedupingInterval: 0, refreshInterval: 10 }}>
      <ExecutiveOverview proposals={proposals} />
    </SWRConfig>
  );
  await act(async () => {
    await connectAccount(view, DEMO_ACCOUNT_TESTS);
  });
  return view;
}

describe('Executive page', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    configure({ asyncUtilTimeout: 4500 });
    injectProvider();

    maker = await getMaker();
    await createDelegate(maker);

    mixpanel.track = () => {};
  });

  beforeEach(async () => {
    await setup();
  });

  afterEach(() => {
    cleanup();
  });

  test('can deposit and withdraw', async () => {
    const depositButton = await screen.findByTestId('deposit-button');

    await act(() => {
      click(depositButton);
    });

    await screen.findByText('Approve voting contract');
    const approveButton = screen.getByTestId('deposit-approve-button');

    await act(() => {
      click(approveButton);
    });

    await screen.findByText('Deposit into voting contract');
    const input = screen.getByTestId('mkr-input');
    fireEvent.change(input, { target: { value: '10' } });
    const finalDepositButton = await screen.findByText('Deposit MKR');
    expect(finalDepositButton).not.toBeDisabled();

    await act(() => {
      click(finalDepositButton);
    });

    const withdrawButton = await screen.findByTestId('withdraw-button');

    await act(() => {
      click(withdrawButton);
    });

    await screen.findByText('Approve voting contract');
    const approveButtonWithdraw = screen.getByTestId('withdraw-approve-button', {}, { timeout: 15000 });

    await act(() => {
      click(approveButtonWithdraw);
    });

    await screen.findByText('Withdraw from voting contract');
    const inputWithdraw = screen.getByTestId('mkr-input');
    fireEvent.change(inputWithdraw, { target: { value: '10' } });

    const finalDepositButtonWithdraw = await screen.findByText('Withdraw MKR');

    expect(finalDepositButtonWithdraw).not.toBeDisabled();

    await act(() => {
      click(finalDepositButtonWithdraw);
    });

    const lockedMKR = await screen.findByTestId('locked-mkr');

    expect(lockedMKR).toHaveTextContent('0.00');
  });

  test('can vote', async () => {
    const [voteButtonOne] = await screen.getAllByTestId('vote-button-exec-overview-card');
    click(voteButtonOne);
    const submitButton = await screen.getByText('Submit Vote');
    click(submitButton);
    //TODO: get the UI to reflect the vote and test for that
  });

  test('shows delegated balance if account is a delegate', async () => {
    accountsApi.getState().addAccountsListener();

    // set delegate in state
    accountsApi.getState().setVoteDelegate(accountsApi.getState().currentAccount?.address || '');

    await screen.findByText(/In delegate contract:/i);

    // switch to non-delegate account
    await switchAccount(maker);

    await screen.findByText(/In voting contract:/i);
  });
});
