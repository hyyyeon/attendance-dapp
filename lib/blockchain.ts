import { BrowserProvider, Contract } from 'ethers'

const attendanceAddress = "0x7a4030E0ddcdab1014e4E8Ae7393194275Ca0b0A"
const tokenAddress = "0x7321E1251ABBE7a72803Ea48b4a84069e2101458"


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
