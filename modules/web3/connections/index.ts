import { initializeConnector } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import { Network } from '@web3-react/network';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { GnosisSafe } from '@makerdao-dux/gnosis-safe';
import { getRPCFromChainID } from 'modules/web3/helpers/getRPC';
import { SupportedChainId } from 'modules/web3/constants/chainID';
import { SUPPORTED_WALLETS, ConnectionType } from '../constants/wallets';
import { Connection } from '../types/connection';

// network
const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  actions =>
    new Network({
      actions,
      urlMap: {
        [SupportedChainId.MAINNET]: getRPCFromChainID(SupportedChainId.MAINNET),
        [SupportedChainId.GOERLI]: getRPCFromChainID(SupportedChainId.GOERLI)
      },
      defaultChainId: 1
    })
);
export const networkConnection: Connection = {
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK
};

// metamask
const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(actions => new MetaMask({ actions }));
export const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED
};

// walletconnect
const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector<any>(
  actions =>
    new WalletConnect({
      actions,
      options: {
        rpc: {
          [SupportedChainId.MAINNET]: getRPCFromChainID(SupportedChainId.MAINNET),
          [SupportedChainId.GOERLI]: getRPCFromChainID(SupportedChainId.GOERLI)
        },
        qrcode: true
      }
    })
);
export const walletConnectConnection: Connection = {
  connector: web3WalletConnect as any,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT
};

// coinbase wallet
const [web3CoinbaseWallet, web3CoinbaseWalletHooks] = initializeConnector<any>(
  actions =>
    new CoinbaseWallet({
      actions,
      options: {
        url: getRPCFromChainID(SupportedChainId.MAINNET),
        appName: 'vote.gsuprotocol.io',
        reloadOnDisconnect: false
      }
    })
);
export const coinbaseWalletConnection: Connection = {
  connector: web3CoinbaseWallet as any,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET
};

// gnosis safe
const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<any>(
  actions => new GnosisSafe({ actions })
);
export const gnosisSafeConnection: Connection = {
  connector: web3GnosisSafe as any,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE
};

export const orderedConnectionTypes = [
  gnosisSafeConnection.type,
  coinbaseWalletConnection.type,
  walletConnectConnection.type,
  injectedConnection.type,
  networkConnection.type
];

const CONNECTIONS = [
  gnosisSafeConnection,
  coinbaseWalletConnection,
  walletConnectConnection,
  injectedConnection,
  networkConnection
];

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = CONNECTIONS.find(connection => connection.connector === c);
    if (!connection) {
      throw Error('unsupported connector');
    }
    return connection;
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection;
      case ConnectionType.COINBASE_WALLET:
        return coinbaseWalletConnection;
      case ConnectionType.WALLET_CONNECT:
        return walletConnectConnection;
      case ConnectionType.NETWORK:
        return networkConnection;
      case ConnectionType.GNOSIS_SAFE:
        return gnosisSafeConnection;
    }
  }
}

export function connectorToWalletName(connector: Connector) {
  const connection = CONNECTIONS.find(connection => connection.connector === connector);

  switch (connection?.type) {
    case ConnectionType.INJECTED:
      return SUPPORTED_WALLETS.MetaMask.name;
    case ConnectionType.COINBASE_WALLET:
      return SUPPORTED_WALLETS['Coinbase Wallet'].name;
    case ConnectionType.WALLET_CONNECT:
      return SUPPORTED_WALLETS.WalletConnect.name;
    case ConnectionType.GNOSIS_SAFE:
      return SUPPORTED_WALLETS['Gnosis Safe'].name;
  }
}
