import { BrowserProvider, Contract } from 'ethers'

const attendanceAddress = "0x912aBF8B99d147f1565efe0A7842A099a43C826e"
const tokenAddress = "0x68F9062a692AF3F0e5924a783590a90851C93F0a"

import attendanceABI from "./attendanceABI.json"
import tokenABI from "./tokenABI.json"

function getProvider() {
  const anyWindow = window as any
  if (!anyWindow.ethereum) throw new Error("지갑이 필요합니다.")
  return new BrowserProvider(anyWindow.ethereum)
}

export async function connectWallet() {
  const provider = getProvider()
  const accounts = await provider.send("eth_requestAccounts", [])
  return accounts[0]
}

export async function getAccount() {
  try {
    const provider = getProvider()
    const accounts = await provider.send("eth_accounts", [])
    return accounts[0] ?? null
  } catch {
    return null
  }
}

async function getAttendanceContract(signer = false) {
  const provider = getProvider()
  const signerOrProvider = signer ? await provider.getSigner() : provider
  return new Contract(attendanceAddress, attendanceABI, signerOrProvider)
}

export async function checkIn() {
  const contract = await getAttendanceContract(true)
  const tx = await contract.checkIn()
  await tx.wait()
}

export async function getLastCheck(account: string) {
  const contract = await getAttendanceContract()
  return await contract.lastCheck(account)
}
