
import React, { useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { useAccountBalance, usePolkadotExtension, createSubstraHooksProvider, useSystemProperties } from '@substra-hooks/core'

const App = () => {

  const SubstraHooksProvider = createSubstraHooksProvider()

  return (
    <SubstraHooksProvider
      defaultApiProviderId="kusama"
      apiProviderConfig={{
        kusama: {
          id: 'kusama',
          wsProviderUrl: 'wss://kusama-rpc.polkadot.io',
        },
        statemine: {
          id: 'statemine',
          wsProviderUrl: 'wss://kusama-statemine-rpc.paritytech.net',
        },
      }}
    >
      <BalanceViewer />
    </SubstraHooksProvider>
  )
}

const BalanceViewer = () => {
  
  const { accounts, w3enable, w3Enabled } = usePolkadotExtension()
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null)
  const { balanceRaw, balanceFormatted } = useAccountBalance(selectedAccount ? selectedAccount.address : null)

  useEffect(() => {
    if (!w3Enabled) {
      w3enable();
    }
  }, [w3Enabled])


  return (
      <>
        <div>
          <h2>Select an account</h2>
          <select onChange={(e) => setSelectedAccount(accounts?.find(account => account.address === e.target.value))}>
          {
            accounts && accounts.map(account => (
              <option value={account.address}>{account.meta.name || account.address}</option>
            ))
          }
        </select>
        </div>
        {
          selectedAccount && 
          <>
            <h2>Balance of {selectedAccount.meta.name || selectedAccount.address}</h2>
              {balanceFormatted && (
                  <div>{balanceFormatted}</div>
              )}
          </>
        }
      </>
  )
}

ReactDOM.render(<App />, document.getElementById("app"))
