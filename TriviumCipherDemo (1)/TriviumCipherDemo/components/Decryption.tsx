'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TriviumState } from './TriviumDemo'
import { decryptTrivium } from '../lib/trivium'

interface DecryptionProps {
  triviumState: TriviumState
}

export default function Decryption({ triviumState }: DecryptionProps) {
  const [ciphertext, setCiphertext] = useState('')
  const [plaintext, setPlaintext] = useState('')
  const [error, setError] = useState('')

  const handleDecrypt = () => {
    if (!triviumState.key || !triviumState.iv) {
      setError('Please generate a key and IV first')
      return
    }
    try {
      const decrypted = decryptTrivium(ciphertext, triviumState.key, triviumState.iv)
      setPlaintext(decrypted)
      setError('')
    } catch (err) {
      setError('Decryption failed. Please check your input and try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trivium Decryption</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Now, we'll decrypt the ciphertext using the same key and IV. This process reverses the encryption to recover the original plaintext.
        </p>
        <div className="space-y-2">
          <Label htmlFor="ciphertext">Ciphertext (Hex)</Label>
          <Input
            id="ciphertext"
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            placeholder="Enter ciphertext to decrypt"
          />
        </div>
        <Button onClick={handleDecrypt}>Decrypt</Button>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {plaintext && (
          <div className="space-y-2">
            <Label htmlFor="plaintext">Decrypted Plaintext</Label>
            <Textarea id="plaintext" value={plaintext} readOnly />
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Decryption Process</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Initialize the Trivium state using the same key and IV as encryption</li>
            <li>Generate the identical keystream by running the Trivium algorithm</li>
            <li>XOR each bit of the ciphertext with the corresponding keystream bit</li>
            <li>Convert the resulting bitstream back to text</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

