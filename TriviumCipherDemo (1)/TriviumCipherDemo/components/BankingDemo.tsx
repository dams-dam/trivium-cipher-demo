'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, CircleDashed, ArrowRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { encryptTrivium, decryptTrivium, hexToBinary } from '../lib/trivium'

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

export default function BankingDemo() {
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [transferStatus, setTransferStatus] = useState<string | null>(null)
  const [encryptedData, setEncryptedData] = useState<string | null>(null)
  const [decryptedData, setDecryptedData] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [keyStreamBits, setKeyStreamBits] = useState<string>('')
  const [currentStep, setCurrentStep] = useState(0)

  // Automatically advance to next step when amount is selected
  useEffect(() => {
    if (amount && currentStep === 0) {
      setCurrentStep(1)
    }
  }, [amount])

  // Automatically advance to next step when recipient is selected
  useEffect(() => {
    if (recipient && currentStep === 1) {
      setCurrentStep(2)
    }
  }, [recipient])

  const handleTransfer = () => {
    setTransferStatus(null)
    setEncryptedData(null)
    setDecryptedData(null)
    setShowDetails(false)
    setKeyStreamBits('')

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
    const keyStreamSample = hexToBinary(encrypted).slice(0, 32).join('')
    setKeyStreamBits(keyStreamSample)

    setTransferStatus('Encrypting and sending data...')
    setTimeout(() => {
      const decrypted = decryptTrivium(encrypted, SERVER_KEY, SERVER_IV)
      setDecryptedData(decrypted)
      setTransferStatus('Transfer successful! Data securely transmitted using Trivium encryption.')
      setShowDetails(true)
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
        </div>
      ),
      isCompleted: !!amount
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
        </div>
      ),
      isCompleted: !!recipient
    },
    {
      title: "Initiate Transfer",
      content: (
        <Button 
          onClick={handleTransfer} 
          className="w-full"
          disabled={!amount || !recipient}
        >
          Secure Transfer with Trivium
        </Button>
      ),
      isCompleted: !!encryptedData
    },
    {
      title: "Review Results",
      content: (
        <div className="space-y-4">
          {transferStatus && (
            <Alert>
              <AlertTitle>Transfer Status</AlertTitle>
              <AlertDescription>{transferStatus}</AlertDescription>
            </Alert>
          )}
          {showDetails && (
            <>
              {encryptedData && (
                <Alert>
                  <AlertTitle>Encrypted Data (sent over network)</AlertTitle>
                  <AlertDescription className="break-all font-mono text-xs">
                    {encryptedData}
                  </AlertDescription>
                </Alert>
              )}
              {decryptedData && (
                <Alert>
                  <AlertTitle>Decrypted Data (on server)</AlertTitle>
                  <AlertDescription className="font-mono">
                    {decryptedData}
                  </AlertDescription>
                </Alert>
              )}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Trivium in Action</h3>
                <p className="text-sm text-gray-600 mb-2">Sample of generated keystream bits:</p>
                <div className="bg-gray-100 p-2 rounded-md font-mono text-xs break-all">
                  {keyStreamBits}
                </div>
              </div>
            </>
          )}
        </div>
      ),
      isCompleted: showDetails
    }
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Secure Bank Transfer using Trivium</CardTitle>
        <CardDescription>Experience real-world application of stream ciphers in finance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn(
              "p-4 border rounded-lg transition-all duration-200",
              index === currentStep && "border-blue-500 bg-blue-50",
              index < currentStep && "border-green-500 bg-green-50",
              index > currentStep && "opacity-50 bg-gray-50",
              step.isCompleted && "border-green-500"
            )}
          >
            <div className="flex items-center gap-2 mb-4">
              {step.isCompleted ? (
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
              index !== currentStep && index > Math.max(0, currentStep - 1) && "opacity-50 pointer-events-none"
            )}>
              {step.content}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <div className="w-full text-center">
          <p className="text-sm text-gray-600">
            This demo showcases how Trivium can be used to secure financial transactions.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}

