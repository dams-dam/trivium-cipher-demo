'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TriviumState } from './TriviumDemo'
import { encryptTrivium } from '../lib/trivium'

interface EncryptionProps {
  triviumState: TriviumState
}

export default function Encryption({ triviumState }: EncryptionProps) {
  const [plaintext, setPlaintext] = useState('')
  const [ciphertext, setCiphertext] = useState('')
  const [error, setError] = useState('')

  const handleEncrypt = () => {
    if (!triviumState.key || !triviumState.iv) {
      setError('Please generate a key and IV first')
      return
    }
    try {
      const encrypted = encryptTrivium(plaintext, triviumState.key, triviumState.iv)
      setCiphertext(encrypted)
      setError('')
    } catch (err) {
      setError('Encryption failed. Please check your input and try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trivium Encryption</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Enter a message to encrypt using the Trivium cipher with the generated key and IV.
        </p>
        <div className="space-y-2">
          <Label htmlFor="plaintext">Plaintext</Label>
          <Input
            id="plaintext"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Enter text to encrypt (e.g., Hello, Professor!)"
          />
        </div>
        <Button onClick={handleEncrypt}>Encrypt</Button>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {ciphertext && (
          <div className="space-y-2">
            <Label htmlFor="ciphertext">Ciphertext (Hex)</Label>
            <Textarea id="ciphertext" value={ciphertext} readOnly />
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Encryption Process</h3>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
            <li>Initialize Trivium state with key and IV</li>
            <li>Generate keystream by running Trivium algorithm</li>
            <li>XOR each plaintext bit with keystream bit</li>
            <li>Convert result to hexadecimal</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

