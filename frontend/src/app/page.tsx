'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useJCDUser } from '@/hooks/useJCDUser';
import { formatEther } from 'viem';

export default function Home() {
  const { jcdTokenBalance, isMember } = useJCDUser();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            JCDAO
          </span>
        </div>
        <ConnectButton />
      </nav>

      <section className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Japan-Chinese
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Developer DAO
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-12">
          A Web3 community connecting Chinese developers in Japan.
          <br />
          Build together, grow together.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div>
                  {!connected && (
                    <button
                      onClick={openConnectModal}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
                    >
                      Connect Wallet to Join
                    </button>
                  )}
                  {connected && (
                    <div className="text-white text-center">
                      <p className="text-lg">Welcome, {account.displayName}!</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Connected to {chain.name}
                      </p>
                      <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-md">
                        <p className="text-white">
                          JCD Balance: <span className="font-bold text-purple-400">{jcdTokenBalance ? formatEther(jcdTokenBalance) : '0'}</span>
                        </p>
                        <p className="text-white">
                          Membership: <span className="font-bold text-pink-400">{isMember ? 'Active' : 'Inactive'}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🎖️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Soulbound Membership
            </h3>
            <p className="text-gray-400">
              Non-transferable NFTs as proof of membership in the DAO.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🗳️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Governance Token
            </h3>
            <p className="text-gray-400">
              $JCD tokens for voting power in DAO decisions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🌏</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Community
            </h3>
            <p className="text-gray-400">
              Connect with developers across Japan and China.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-gray-500">
        <p>© 2026 JCDAO. Built on Polygon.</p>
      </footer>
    </main>
  );
}
