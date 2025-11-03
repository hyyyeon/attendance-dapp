// attendance-dapp/app/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { connectWallet, checkIn, getLastCheck, getAccount } from '@/lib/blockchain'

export default function Home() {
  const [account, setAccount] = useState<string | null>(null)
  const [lastCheckTime, setLastCheckTime] = useState<number>(0)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const acc = await getAccount()
    if (acc) {
      setAccount(acc)
      const last = await getLastCheck(acc)
      setLastCheckTime(Number(last))
    }
  }

  async function onConnect() {
    const acc = await connectWallet()
    setAccount(acc)
    const last = await getLastCheck(acc)
    setLastCheckTime(Number(last))
  }

  async function onCheckIn() {
    try {
      await checkIn()
      setMessage('출석 완료! 도장 받았습니다')
      const last = await getLastCheck(account!)
      setLastCheckTime(Number(last))
    } catch (e: any) {
      setMessage(e.message ?? '출석 실패')
    }
  }

  const canCheck = Date.now()/1000 - lastCheckTime >= 86400

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F5F8FF] p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">출석체크</h1>
      <p className="text-gray-600 mb-8">92313489 윤지현</p>

      {/* Card */}
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md border border-blue-200">

        <div className="text-sm text-gray-600 mb-2">지갑 주소</div>
        <div className="p-3 bg-gray-50 rounded-md border font-mono text-xs break-all mb-4">
          {account ?? '지갑 연결 필요'}
        </div>

        {/* Stamp Button */}
        {account ? (
          <button
            onClick={onCheckIn}
            disabled={!canCheck}
            className={`w-full py-4 rounded-lg text-lg font-bold transition-all ${
              canCheck
                ? 'bg-[#4E6EF2] text-white hover:bg-[#3a53c7]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {canCheck ? '출석 도장 찍기' : '이미 출석했어요'}
          </button>
        ) : (
          <button 
            onClick={onConnect} 
            className="w-full py-4 bg-[#4E6EF2] text-white rounded-lg font-bold hover:bg-[#3a53c7]"
          >
            지갑 연결하기
          </button>
        )}

        {/* Last check */}
        <div className="mt-4 text-sm text-gray-600">
          마지막 출석: {lastCheckTime === 0 ? '기록 없음' : new Date(lastCheckTime*1000).toLocaleString()}
        </div>

        {message && (
          <div className="mt-4 p-3 bg-purple-100 border border-purple-300 text-purple-700 rounded-md text-sm">
            {message}
          </div>
        )}
      </div>
    </main>
  )
}
