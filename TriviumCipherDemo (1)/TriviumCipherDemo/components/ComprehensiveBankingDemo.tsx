'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, CircleDashed, ArrowRight, Lock, Unlock } from 'lucide-react'
import { cn } from "@/lib/utils"
import { encryptTrivium, decryptTrivium, hexToBinary, binaryToHex } from '../lib/trivium'

const SERVER_KEY = '0123456789abcdef0123'
const SERVER_IV = 'fedcba9876543210fedc'

const PRESET_AMOUNTS = [
  { value: '100', label: '€100' },
  { value: '500', label: '€500' },
  { value: '1000', label: '€1000' },
]

const PRESET_RECIPIENTS = [
  { value: '123456789', label: 'Alice (123456789)' },
  { value: '987654321', label: 'Bob (987654321)' },
  { value: '456789123', label: 'Charlie (456789123)' },
]

export default function ComprehensiveBankingDemo() {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [transferStatus, setTransferStatus] = useState<string | null>(null)
  const [encryptedData, setEncryptedData] = useState<string | null>(null)
  const [decryptedData, setDecryptedData] = useState<string | null>(null)
  const [keyStreamBits, setKeyStreamBits] = useState<string>('')
  const [currentStep, setCurrentStep] = useState(0)
  const [isEncrypted, setIsEncrypted] = useState(false)

  useEffect(() => {
    if (amount && currentStep === 0) setCurrentStep(1)
  }, [amount])

  useEffect(() => {
    if (recipient && currentStep === 1) setCurrentStep(2)
  }, [recipient])

  const handleTransfer = () => {
    setTransferStatus(null)
    setEncryptedData(null)
    setDecryptedData(null)
    setKeyStreamBits('')
    setIsEncrypted(false)

    if (!amount || !recipient) {
      setTransferStatus('Please select both an amount and a recipient.')
      return
    }

    setCurrentStep(3)
    const transferData = JSON.stringify({ amount, recipient, timestamp: Date.now() })

    // Encrypt transfer data using Trivium
    const encrypted = encryptTrivium(transferData, SERVER_KEY, SERVER_IV)
    setEncryptedData(encrypted)

    // Generate a sample of the keystream for demonstration
    const keyStreamSample = hexToBinary(encrypted).slice(0, 64).join('')
    setKeyStreamBits(keyStreamSample)

    setTransferStatus('Encrypting and sending data...')
    setIsEncrypted(true)
    
    setTimeout(() => {
      const decrypted = decryptTrivium(encrypted, SERVER_KEY, SERVER_IV)
      setDecryptedData(decrypted)
      setTransferStatus('Transfer successful! Data securely transmitted using Trivium encryption.')
      setCurrentStep(4)
    }, 2000)
  }

  const steps = [
    {
      title: "Select Transfer Amount",
      content: (
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Select onValueChange={setAmount} value={amount}>
            <SelectTrigger id="amount" className="w-full">
              <SelectValue placeholder="Select amount" />
            </SelectTrigger>
            <SelectContent>
              {PRESET_AMOUNTS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">This simulates the first step in a secure banking transaction.</p>
        </div>
      ),
      explanation: "In a real-world scenario, the amount would be carefully validated and checked against account balances and transfer limits."
    },
    {
      title: "Choose Recipient",
      content: (
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient</Label>
          <Select onValueChange={setRecipient} value={recipient}>
            <SelectTrigger id="recipient" className="w-full">
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              {PRESET_RECIPIENTS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">In a real system, this would be securely stored and verified.</p>
        </div>
      ),
      explanation: "Recipient information is crucial and would typically involve additional security measures like two-factor authentication for new recipients."
    },
    {
      title: "Initiate Secure Transfer",
      content: (
        <div className="space-y-2">
          <Button 
            onClick={handleTransfer} 
            className="w-full"
            disabled={!amount || !recipient}
          >
            Secure Transfer with Trivium
          </Button>
          <p className="text-sm text-gray-500">This triggers the Trivium encryption process.</p>
        </div>
      ),
      explanation: "At this stage, the transfer data is prepared and the Trivium cipher is initialized with the secret key and IV."
    },
    {
      title: "Encryption and Transmission",
      content: (
        <div className="space-y-4">
          <Alert>
            <AlertTitle>Encryption Status</AlertTitle>
            <AlertDescription>{transferStatus}</AlertDescription>
          </Alert>
          {encryptedData && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Encrypted Data (sent over network):</h4>
              <p className="bg-gray-100 p-2 rounded text-xs font-mono break-all">
                {encryptedData}
              </p>
            </div>
          )}
          {keyStreamBits && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Keystream Sample (first 64 bits):</h4>
              <div className="bg-gray-100 p-2 rounded font-mono text-xs break-all">
                {Array.from(keyStreamBits).map((bit, index) => (
                  <span key={index} className={bit === '1' ? 'text-blue-600' : 'text-red-600'}>
                    {bit}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Blue: 1, Red: 0</p>
            </div>
          )}
        </div>
      ),
      explanation: "The Trivium cipher generates a keystream that is XORed with the plaintext to produce the ciphertext. This process is fast and suitable for streaming applications."
    },
    {
      title: "Decryption and Verification",
      content: (
        <div className="space-y-4">
          <Alert>
            <AlertTitle>Decryption Status</AlertTitle>
            <AlertDescription>{transferStatus}</AlertDescription>
          </Alert>
          {decryptedData && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Decrypted Data (on server):</h4>
              <p className="bg-gray-100 p-2 rounded text-sm font-mono">
                {decryptedData}
              </p>
            </div>
          )}
          <div className="flex items-center justify-center">
            {isEncrypted ? (
              <Lock className="text-green-500 h-8 w-8" />
            ) : (
              <Unlock className="text-red-500 h-8 w-8" />
            )}
            <span className="ml-2 text-sm font-semibold">
              {isEncrypted ? 'Data Securely Encrypted' : 'Data Not Encrypted'}
            </span>
          </div>
        </div>
      ),
      explanation: "The decryption process uses the same keystream to recover the original plaintext. In a real system, additional integrity checks would be performed."
    }
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Comprehensive Trivium Banking Demo</CardTitle>
        <CardDescription>Experience a detailed simulation of Trivium cipher in financial transactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "p-4 border rounded-lg transition-all duration-200",
              index === currentStep && "border-blue-500 bg-blue-50",
              index < currentStep && "border-green-500 bg-green-50",
              index > currentStep && "opacity-50 bg-gray-50"
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              {index < currentStep ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : index === currentStep ? (
                <ArrowRight className="h-5 w-5 text-blue-500" />
              ) : (
                <CircleDashed className="h-5 w-5 text-gray-400" />
              )}
              <h3 className="text-lg font-semibold">
                Step {index + 1}: {step.title}
              </h3>
            </div>
            <div className={cn(
              "transition-all duration-200",
              index !== currentStep && "opacity-50 pointer-events-none"
            )}>
              {step.content}
            </div>
            <Separator className="my-4" />
            <div className="text-sm text-gray-600">
              <strong>Explanation:</strong> {step.explanation}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <div className="w-full text-center">
          <p className="text-sm text-gray-600">
            This comprehensive demo showcases how Trivium can be applied to secure financial transactions, 
            demonstrating its efficiency and security in practical applications.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}

