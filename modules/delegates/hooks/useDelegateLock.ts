import { Dispatch, SetStateAction, useState } from 'react';
import { getEthersContracts } from 'modules/web3/helpers/getEthersContracts';
import abi from 'modules/contracts/ethers/voteDelegate.json';
import { useWeb3 } from 'modules/web3/hooks/useWeb3';
import useTransactionStore, {
  transactionsSelectors,
  transactionsApi
} from 'modules/web3/stores/transactions';
import { shallow } from 'zustand/shallow';
import { BigNumber } from 'ethers';
import { Transaction } from 'modules/web3/types/transaction';
import { VoteDelegate } from 'types/ethers-contracts';

type LockResponse = {
  txId: string | null;
  setTxId: Dispatch<SetStateAction<null>>;
  lock: (mkrToDeposit: BigNumber, callbacks?: Record<string, () => void>) => void;
  tx: Transaction | null;
};

export const useDelegateLock = (voteDelegateAddress: string): LockResponse => {
  const [txId, setTxId] = useState<string | null>(null);

  const { chainId, provider, account } = useWeb3();

  const [track, tx] = useTransactionStore(
    state => [state.track, txId ? transactionsSelectors.getTransaction(state, txId) : null],
    shallow
  );

  const vdContract = getEthersContracts<VoteDelegate>(voteDelegateAddress, abi, chainId, provider, account);

  const lock = (mkrToDeposit: BigNumber, callbacks?: Record<string, () => void>) => {
    const lockTxCreator = () => vdContract.lock(mkrToDeposit);
    const txId = track(lockTxCreator, account, 'Depositing GSUp', {
      pending: () => {
        if (typeof callbacks?.pending === 'function') callbacks.pending();
      },
      mined: txId => {
        transactionsApi.getState().setMessage(txId, 'GSUp deposited');
        if (typeof callbacks?.mined === 'function') callbacks.mined();
      },
      error: txId => {
        transactionsApi.getState().setMessage(txId, 'GSUp deposit failed');
        if (typeof callbacks?.error === 'function') callbacks.error();
      }
    });
    setTxId(txId);
  };

  return { txId, setTxId, lock, tx };
};
