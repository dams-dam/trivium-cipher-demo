'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { updateTriviumState, initializeTrivium } from '../lib/trivium'

const INITIAL_KEY = '0123456789abcdef0123'
const INITIAL_IV = 'fedcba9876543210fedc'

export default function TriviumDetailedExplanation() {
  const [state, setState] = useState<number[]>([])
  const [step, setStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [keystream, setKeystream] = useState<number[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const initialState = initializeTrivium(INITIAL_KEY, INITIAL_IV)
    setState(initialState)
  }, [])

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        nextStep()
      }, speed)
      return () => clearInterval(interval)
    }
  }, [isAutoPlaying, speed])

  useEffect(() => {
    drawState()
  }, [state, step])

  const nextStep = () => {
    setState(prevState => {
      const { updatedState, keystreamBit } = updateTriviumState(prevState)
      setKeystream(prev => [...prev, keystreamBit])
      return updatedState
    })
    setStep(prev => prev + 1)
  }

  const drawState = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    // Draw registers
    const registerColors = ['#34D399', '#60A5FA', '#FBBF24']
    const registerLengths = [93, 84, 111]
    let y = 50
    registerLengths.forEach((length, index) => {
      ctx.fillStyle = registerColors[index]
      for (let i = 0; i < length; i++) {
        const bitIndex = index === 0 ? i : (index === 1 ? i + 93 : i + 93 + 84)
        ctx.fillRect(i * 5 + 10, y, 4, 20)
        if (state[bitIndex]) {
          ctx.fillStyle = '#000'
          ctx.fillRect(i * 5 + 11, y + 1, 2, 18)
          ctx.fillStyle = registerColors[index]
        }
      }
      y += 40
    })

    // Draw XOR operations
    ctx.fillStyle = '#FF0000'
    ctx.font = '20px Arial'
    ctx.fillText('⊕', 465, 60)
    ctx.fillText('⊕', 420, 100)
    ctx.fillText('⊕', 555, 140)

    // Draw AND operations
    ctx.fillStyle = '#0000FF'
    ctx.fillText('∧', 450, 60)
    ctx.fillText('∧', 405, 100)
    ctx.fillText('∧', 540, 140)

    // Draw output
    ctx.fillStyle = '#000'
    ctx.fillText('Output', 580, 100)
    ctx.beginPath()
    ctx.moveTo(570, 100)
    ctx.lineTo(620, 100)
    ctx.stroke()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Detailed Trivium Explanation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <canvas ref={canvasRef} width={640} height={200} className="w-full" />
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={nextStep} disabled={isAutoPlaying}>Next Step</Button>
          <Button onClick={() => setIsAutoPlaying(!isAutoPlaying)}>
            {isAutoPlaying ? 'Pause' : 'Auto Play'}
          </Button>
          <div className="flex items-center space-x-2">
            <Label htmlFor="speed">Speed:</Label>
            <Slider
              id="speed"
              min={100}
              max={1000}
              step={100}
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
              className="w-32"
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Current Step: {step}</h3>
          <p className="text-sm text-gray-600">
            {step < 1152
              ? `Initialization: ${step}/1152`
              : `Keystream Generation: ${step - 1152}`}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Generated Keystream:</h3>
          <div className="bg-gray-100 p-2 rounded-lg overflow-x-auto">
            <code className="text-sm">
              {keystream.map((bit, index) => (
                <span key={index} className={bit ? 'text-green-600' : 'text-red-600'}>
                  {bit}
                </span>
              ))}
            </code>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Current Step Explanation:</h3>
          <p className="text-sm text-gray-600">
            {step < 1152
              ? `During initialization, Trivium performs 1152 rotations without producing output. 
                 This ensures that the internal state is sufficiently mixed before starting keystream generation.`
              : `At each step, Trivium:
                 1. Computes three intermediate bits (t1, t2, t3) using XOR operations.
                 2. Generates a keystream bit by XORing t1, t2, and t3.
                 3. Updates the internal state using AND and XOR operations.
                 4. Rotates the registers.`
            }
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Key Points for the Professor:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Trivium uses three non-linear feedback shift registers (NFSR) of lengths 93, 84, and 111 bits.</li>
            <li>The total internal state is 288 bits (93 + 84 + 111).</li>
            <li>Basic operations are XOR (⊕) and AND (∧), making Trivium efficient in hardware.</li>
            <li>The 1152-step initialization phase ensures complete diffusion of the key and IV.</li>
            <li>After initialization, each step produces one keystream bit.</li>
            <li>Security relies on the difficulty of predicting the internal state from the observed keystream.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

