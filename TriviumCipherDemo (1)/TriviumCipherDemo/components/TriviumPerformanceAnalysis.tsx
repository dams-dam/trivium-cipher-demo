'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { encryptTrivium, decryptTrivium } from '../lib/trivium'

export default function TriviumPerformanceAnalysis() {
  const [inputSize, setInputSize] = useState<number>(1000)
  const [performanceData, setPerformanceData] = useState<any[]>([])

  const runPerformanceTest = () => {
    const testSizes = [inputSize, inputSize * 2, inputSize * 5, inputSize * 10]
    const newPerformanceData = []

    for (const size of testSizes) {
      const input = 'A'.repeat(size)
      const key = '0123456789abcdef0123'
      const iv = 'fedcba9876543210fedc'

      const encryptStart = performance.now()
      const encrypted = encryptTrivium(input, key, iv)
      const encryptEnd = performance.now()

      const decryptStart = performance.now()
      const decrypted = decryptTrivium(encrypted, key, iv)
      const decryptEnd = performance.now()

      newPerformanceData.push({
        size,
        encryptTime: isNaN(encryptEnd - encryptStart) ? 0 : encryptEnd - encryptStart,
        decryptTime: isNaN(decryptEnd - decryptStart) ? 0 : decryptEnd - decryptStart,
        throughputMbps: isNaN((size * 8) / ((encryptEnd - encryptStart) * 1000)) ? 0 : (size * 8) / ((encryptEnd - encryptStart) * 1000),
      })
    }

    setPerformanceData(newPerformanceData)
  }

  useEffect(() => {
    runPerformanceTest()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trivium Performance Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="inputSize">Base Input Size (bytes):</Label>
          <Input
            id="inputSize"
            type="number"
            value={inputSize.toString()}
            onChange={(e) => setInputSize(parseInt(e.target.value) || 1000)}
            className="w-24"
          />
          <Button onClick={runPerformanceTest}>Run Test</Button>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="size" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="encryptTime" name="Encryption Time (ms)" fill="#8884d8" />
              <Bar yAxisId="left" dataKey="decryptTime" name="Decryption Time (ms)" fill="#82ca9d" />
              <Bar yAxisId="right" dataKey="throughputMbps" name="Throughput (Mbps)" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Performance Analysis</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>The graph shows encryption and decryption times for different input sizes.</li>
            <li>Throughput is calculated in Megabits per second (Mbps) for encryption.</li>
            <li>Trivium demonstrates consistent performance across various input sizes.</li>
            <li>The algorithm's simplicity contributes to its efficiency in both software and hardware implementations.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

