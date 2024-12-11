'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowRight, Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { initializeTrivium, updateTriviumState } from '../lib/trivium'

const REGISTER_COLORS = ['#34D399', '#60A5FA', '#FBBF24']
const XOR_COLOR = '#EF4444'
const AND_COLOR = '#8B5CF6'

interface TriviumDetailedVisualizationProps {
  initialKey: string
  initialIV: string
}

export default function TriviumDetailedVisualization({ initialKey, initialIV }: TriviumDetailedVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [state, setState] = useState<number[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [step, setStep] = useState(0)
  const [keystream, setKeystream] = useState<number[]>([])
  const [explanation, setExplanation] = useState('')
  const [key, setKey] = useState(initialKey)
  const [iv, setIV] = useState(initialIV)
  const [mode, setMode] = useState<'continuous' | 'step-by-step'>('continuous')

  useEffect(() => {
    initializeState()
  }, [])

  useEffect(() => {
    if (isRunning && mode === 'continuous') {
      const timer = setTimeout(updateState, speed)
      return () => clearTimeout(timer)
    }
  }, [isRunning, state, speed, mode])

  useEffect(() => {
    drawState()
  }, [state, step])

  const initializeState = () => {
    const newState = initializeTrivium(key, iv)
    setState(newState)
    setStep(0)
    setKeystream([])
    setExplanation('État initial du Trivium après initialisation avec la clé et l\'IV.')
  }

  const updateState = () => {
    const { updatedState, keystreamBit } = updateTriviumState(state)
    setState(updatedState)
    setKeystream(prev => [...prev, keystreamBit])
    setStep(prev => prev + 1)
    updateExplanation(updatedState, keystreamBit)
  }

  const updateExplanation = (newState: number[], keystreamBit: number) => {
    const t1 = newState[65] ^ newState[92]
    const t2 = newState[161] ^ newState[176]
    const t3 = newState[242] ^ newState[287]
    setExplanation(`
      Étape ${step + 1}:
      t1 = s[66] ⊕ s[93] = ${newState[65]} ⊕ ${newState[92]} = ${t1}
      t2 = s[162] ⊕ s[177] = ${newState[161]} ⊕ ${newState[176]} = ${t2}
      t3 = s[243] ⊕ s[288] = ${newState[242]} ⊕ ${newState[287]} = ${t3}
      Bit de flux de clé = t1 ⊕ t2 ⊕ t3 = ${t1} ⊕ ${t2} ⊕ ${t3} = ${keystreamBit}
      
      Nouveaux bits insérés:
      s[1] = t3 ⊕ (s[286] ∧ s[287]) ⊕ s[69] = ${t3} ⊕ (${newState[285]} ∧ ${newState[286]}) ⊕ ${newState[68]} = ${newState[0]}
      s[94] = t1 ⊕ (s[91] ∧ s[92]) ⊕ s[171] = ${t1} ⊕ (${newState[90]} ∧ ${newState[91]}) ⊕ ${newState[170]} = ${newState[93]}
      s[178] = t2 ⊕ (s[175] ∧ s[176]) ⊕ s[264] = ${t2} ⊕ (${newState[174]} ∧ ${newState[175]}) ⊕ ${newState[263]} = ${newState[177]}
    `)
  }

  const drawState = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.4

    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.translate(centerX, centerY)

    // Draw registers
    for (let i = 0; i < 3; i++) {
      const registerRadius = radius * (0.8 + i * 0.1)
      ctx.beginPath()
      ctx.arc(0, 0, registerRadius, 0, 2 * Math.PI)
      ctx.strokeStyle = REGISTER_COLORS[i]
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw bits
      for (let j = 0; j < 93; j++) {
        const angle = (j / 93) * 2 * Math.PI - Math.PI / 2
        const x = Math.cos(angle) * registerRadius
        const y = Math.sin(angle) * registerRadius
        const bitIndex = i * 93 + j
        
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, 2 * Math.PI)
        ctx.fillStyle = state[bitIndex] ? REGISTER_COLORS[i] : '#FFFFFF'
        ctx.fill()
        ctx.stroke()
      }
    }

    // Draw XOR operations
    drawOperation(ctx, 0, -radius * 0.8, XOR_COLOR, '⊕')
    drawOperation(ctx, radius * 0.7, radius * 0.4, XOR_COLOR, '⊕')
    drawOperation(ctx, -radius * 0.7, radius * 0.4, XOR_COLOR, '⊕')

    // Draw AND operations
    drawOperation(ctx, 0, radius * 0.9, AND_COLOR, '∧')
    drawOperation(ctx, radius * 0.78, -radius * 0.45, AND_COLOR, '∧')
    drawOperation(ctx, -radius * 0.78, -radius * 0.45, AND_COLOR, '∧')

    ctx.restore()
  }

  const drawOperation = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, symbol: string) => {
    ctx.fillStyle = color
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(symbol, x, y)
  }

  const handlePlayPause = () => setIsRunning(!isRunning)
  const handleStep = () => {
    setMode('step-by-step')
    updateState()
  }
  const handleReset = () => initializeState()
  const handleSpeedChange = (value: number[]) => setSpeed(1000 - value[0])
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value)
  const handleIVChange = (e: React.ChangeEvent<HTMLInputElement>) => setIV(e.target.value)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Visualisation détaillée du Trivium</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas ref={canvasRef} width={600} height={600} className="border rounded-lg" />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handlePlayPause}>
            {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isRunning ? 'Pause' : 'Démarrer'}
          </Button>
          <Button onClick={handleStep}>
            <StepForward className="mr-2 h-4 w-4" />
            Étape suivante
          </Button>
          <Button onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="speed">Vitesse de simulation</Label>
          <Slider
            id="speed"
            min={0}
            max={990}
            step={10}
            value={[1000 - speed]}
            onValueChange={handleSpeedChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="key">Clé (80 bits, hex)</Label>
            <Input id="key" value={key} onChange={handleKeyChange} />
          </div>
          <div>
            <Label htmlFor="iv">IV (80 bits, hex)</Label>
            <Input id="iv" value={iv} onChange={handleIVChange} />
          </div>
        </div>
        <Tabs defaultValue="state" className="w-full">
          <TabsList>
            <TabsTrigger value="state">État actuel</TabsTrigger>
            <TabsTrigger value="keystream">Flux de clé</TabsTrigger>
            <TabsTrigger value="explanation">Explication</TabsTrigger>
          </TabsList>
          <TabsContent value="state">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>État du Trivium (étape {step})</AlertTitle>
              <AlertDescription>
                <div className="font-mono text-xs break-all">
                  {state.map((bit, index) => (
                    <span key={index} className={bit ? 'text-green-600' : 'text-red-600'}>
                      {bit}
                    </span>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="keystream">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Flux de clé généré</AlertTitle>
              <AlertDescription>
                <div className="font-mono text-xs break-all">
                  {keystream.map((bit, index) => (
                    <span key={index} className={bit ? 'text-green-600' : 'text-red-600'}>
                      {bit}
                    </span>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="explanation">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Explication de l'étape actuelle</AlertTitle>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-xs">{explanation}</pre>
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

