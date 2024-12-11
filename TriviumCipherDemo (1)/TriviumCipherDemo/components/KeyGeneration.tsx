'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TriviumState } from './TriviumDemo'

interface KeyGenerationProps {
  onKeyGenerated: (state: TriviumState) => void
}

export default function KeyGeneration({ onKeyGenerated }: KeyGenerationProps) {
  const [key, setKey] = useState('')
  const [iv, setIv] = useState('')
  const [error, setError] = useState('')

  const handleGenerateKey = () => {
    if (key.length !== 20 || !/^[0-9A-Fa-f]+$/.test(key)) {
      setError('Key must be 20 hexadecimal characters (80 bits)')
      return
    }
    if (iv.length !== 20 || !/^[0-9A-Fa-f]+$/.test(iv)) {
      setError('IV must be 20 hexadecimal characters (80 bits)')
      return
    }
    onKeyGenerated({ key, iv })
    setError('')
  }

  const handleAutoGenerate = () => {
    const newKey = Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    const newIv = Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    setKey(newKey)
    setIv(newIv)
    onKeyGenerated({ key: newKey, iv: newIv })
    setError('')
  }

  // useEffect hook removed

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key and IV Generation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Trivium requires an 80-bit key and an 80-bit initialization vector (IV). You can enter them manually or use the auto-generate feature.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="key">Key (80 bits, hex)</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g., 0f1e2d3c4b5a6978"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="iv">IV (80 bits, hex)</Label>
            <Input
              id="iv"
              value={iv}
              onChange={(e) => setIv(e.target.value)}
              placeholder="e.g., a1b2c3d4e5f67890"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <Button onClick={handleGenerateKey}>Generate Key Pair</Button>
          <Button onClick={handleAutoGenerate} variant="default" className="bg-green-500 hover:bg-green-600">
            Auto-Generate (Recommended)
          </Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {key && iv && !error && (
          <Alert>
            <AlertTitle>Key Pair Generated</AlertTitle>
            <AlertDescription>
              <p>Key: {key}</p>
              <p>IV: {iv}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Key and IV Importance in Trivium</h3>
          <p className="text-sm text-gray-600">
            The 80-bit key is the secret component shared between sender and receiver. The 80-bit IV (Initialization Vector) ensures unique encryption for each session, preventing replay attacks. Together, they initialize Trivium's 288-bit internal state, which is a unique feature of this cipher.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

