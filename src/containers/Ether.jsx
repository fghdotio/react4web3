import { useState, useEffect, useRef, Fragment } from 'react'
import { ethers } from 'ethers'
import { Button, Modal } from 'antd'

import { useGlobalState, setGlobalState, globalFields } from '../models'
import someABI, { contractAddress } from './someabi'

// https://chainid.network/chains.json
// https://chainlist.org/
const BinanceSmartChainMainnet = {
  chainName: 'Binance Smart Chain Mainnet',
  rpcUrls: [
    'https://bsc-dataseed1.binance.org',
    'https://bsc-dataseed2.binance.org',
    'https://bsc-dataseed3.binance.org',
    'https://bsc-dataseed4.binance.org',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed2.defibit.io',
    'https://bsc-dataseed3.defibit.io',
    'https://bsc-dataseed4.defibit.io',
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed2.ninicoin.io',
    'https://bsc-dataseed3.ninicoin.io',
    'https://bsc-dataseed4.ninicoin.io',
    'wss://bsc-ws-node.nariox.org',
  ],
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  chainId: `0x${Number(56).toString(16)}`,
  blockExplorerUrls: ['https://bscscan.com'],
}

const BinanceSmartChainTestnet = {
  chainName: 'Binance Smart Chain Testnet',
  rpcUrls: [
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    'https://data-seed-prebsc-2-s1.binance.org:8545',
    'https://data-seed-prebsc-1-s2.binance.org:8545',
    'https://data-seed-prebsc-2-s2.binance.org:8545',
    'https://data-seed-prebsc-1-s3.binance.org:8545',
    'https://data-seed-prebsc-2-s3.binance.org:8545',
  ],
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
    decimals: 18,
  },
  chainId: `0x${Number(97).toString(16)}`,
  blockExplorerUrls: ['https://testnet.binance.org/faucet-smart'],
}

function Ether() {
  const [address] = useGlobalState(globalFields.ADDRESS)
  const metamaskInstalled = typeof window.ethereum !== 'undefined'
  const prevAddrRef = useRef()
  const handleAccountChange = (accounts) => {
    if (
      accounts.length > 0 &&
      prevAddrRef.current !== null &&
      prevAddrRef.current != accounts[0]
    ) {
      setGlobalState(globalFields.ADDRESS, accounts[0])
      prevAddrRef.current = accounts[0]
    }
  }
  useEffect(() => {
    if (metamaskInstalled) {
      window.ethereum.on('accountsChanged', handleAccountChange)
      return () =>
        window.ethereum.removeListener('accountsChanged', handleAccountChange)
    }
  }, [address])

  const [modalVisibility, setModalVisibility] = useState(false)

  // Metamask app 要在 app 内的浏览器里查看
  const handleConnectMetamask = async () => {
    try {
      let metamaskTimeout
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      let network = await Promise.race([
        provider.getNetwork(),
        new Promise((_, reject) => {
          metamaskTimeout = setTimeout(() => reject('timeout'), 30000)
        }),
      ])
      clearTimeout(metamaskTimeout)
      if (network.chainId !== Number(BinanceSmartChainTestnet.chainId)) {
        // 切换（添加）网络不成功不会抛错
        await provider.send('wallet_addEthereumChain', [
          { ...BinanceSmartChainTestnet },
        ])
      }
      network = await provider.getNetwork()
      if (network.chainId !== Number(BinanceSmartChainTestnet.chainId)) {
        throw 'switch network failed'
      }
      const res = await provider.send('eth_requestAccounts', [])

      setGlobalState(globalFields.ADDRESS, res[0])
      setModalVisibility(false)
    } catch (e) {
      /*Error: underlying network changed (event="changed", network={"chainId":43114,"name":"unknown"}, detectedNetwork={"name":"bnb","chainId":56,"ensAddress":null,"_defaultProvider":null}, code=NETWORK_ERROR, version=providers/5.5.3)
      at Logger.makeError (index.ts:207:1)
      at Web3Provider.<anonymous> (base-provider.ts:968:1)
      at Generator.next (<anonymous>)
      at fulfilled (_version.ts:1:1)*/
      console.log(e)
    }
  }
  const handleLogout = () => {
    setGlobalState(globalFields.ADDRESS, null)
  }

  // https://docs.binance.org/smart-chain/wallet/wallet_api.html
  const handleConnectBinanceWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.BinanceChain)
    const res = await provider.send('eth_accounts', [])
    console.log(res)
  }

  const handleSignMessage = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    // console.log(address)
    // const addressBytes = ethers.utils.arrayify(address)
    // const signature = await signer.signMessage(addressBytes)
    // console.log(signature)
    let bscBalance = await provider.getBalance(address)
    console.log(ethers.utils.formatEther(bscBalance))

    // const someContract = new ethers.Contract(contractAddress, someABI, provider)
    // const someContractWithSigner = someContract.connect(signer)
    // const res = await someContractWithSigner.set(1)
    // console.log(res)
    // const num = await someContract.num()
    // console.log(num.toNumber())

    // https://github.com/ethers-io/ethers.js/issues/511
    const someContract = new ethers.Contract(
      contractAddress,
      someABI,
      signer.connectUnchecked()
    )
    const tx = await someContract.set(1)
    console.log(tx)
    const res = await tx.wait()
    console.log(res)
  }

  return (
    <Fragment>
      <div>
        {address ? (
          <div>
            <span>{address}</span>
            <Button type="primary" onClick={handleLogout}>
              Logout
            </Button>
            <Button type="primary" onClick={handleSignMessage}>
              Sign public key
            </Button>
          </div>
        ) : (
          <Button type="primary" onClick={() => setModalVisibility(true)}>
            Connect
          </Button>
        )}
      </div>
      <Modal
        title="Select wallet to connect"
        visible={modalVisibility}
        onOk={() => setModalVisibility(false)}
        onCancel={() => setModalVisibility(false)}
        maskClosable={false}
        // https://segmentfault.com/a/1190000040975322
        transitionName=""
        maskTransitionName=""
      >
        <div>
          {metamaskInstalled ? (
            <div>
              <Button type="primary" onClick={handleConnectMetamask}>
                Metamask
              </Button>
            </div>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                window.open(
                  'https://reactrouter.com/docs/en/v6/getting-started/tutorial#navigating-programmatically'
                )
                setModalVisibility(false)
              }}
            >
              Install Metamask
            </Button>
          )}
          {window.BinanceChain ? (
            <div>
              <Button type="primary" onClick={handleConnectBinanceWallet}>
                Binance Wallet
              </Button>
            </div>
          ) : (
            <p>Install Binance Wallet</p>
          )}
        </div>
      </Modal>
    </Fragment>
  )
}

export default Ether
