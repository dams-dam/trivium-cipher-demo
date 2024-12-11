'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowRight, Pause, Play, RotateCcw, StepForward, FastForward, Rewind } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { updateTriviumState, initializeTrivium } from '../lib/trivium'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'

const REGISTER_COLORS = ['#34D399', '#60A5FA', '#FBBF24']
const XOR_COLOR = '#EF4444'
const AND_COLOR = '#8B5CF6'

const PRE_GENERATED_KEYS = [
  { key: '0123456789abcdef0123', iv: 'fedcba9876543210fedc', label: 'Default' },
  { key: 'a1b2c3d4e5f6789012ab', iv: '1a2b3c4d5e6f789012cd', label: 'Alternate' },
  { key: '9876543210abcdef1234', iv: '4321fedcba9876543210', label: 'Reverse' },
]

interface TriviumVisualizationProps {
  initialKey?: string
  initialIV?: string
}

export default function TriviumVisualization({ initialKey, initialIV }: TriviumVisualizationProps) {
  const [state, setState] = useState<number[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [step, setStep] = useState(0)
  const [keystream, setKeystream] = useState<number[]>([])
  const [explanation, setExplanation] = useState<string>('')
  const [key, setKey] = useState(initialKey || PRE_GENERATED_KEYS[0].key)
  const [iv, setIV] = useState(initialIV || PRE_GENERATED_KEYS[0].iv)
  const [history, setHistory] = useState<number[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [performanceData, setPerformanceData] = useState<{ step: number, keystream: number }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    initializeState()
  }, [key, iv])

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        updateState()
      }, speed)
      return () => clearInterval(interval)
    }
  }, [isRunning, speed])

  useEffect(() => {
    drawState()
  }, [state, step])

  const initializeState = () => {
    const newState = initializeTrivium(key, iv)
    setState(newState)
    setStep(0)
    setKeystream([])
    setHistory([newState])
    setHistoryIndex(0)
    setPerformanceData([])
    setExplanation('Initial Trivium state after initialization with key and IV.')
  }

  const updateState = () => {
    setState(prevState => {
      const { updatedState, keystreamBit } = updateTriviumState(prevState)
      setKeystream(prev => [...prev, keystreamBit])
      setStep(prev => prev + 1)
      setHistory(prev => [...prev.slice(0, historyIndex + 1), updatedState])
      setHistoryIndex(prev => prev + 1)
      setPerformanceData(prev => [...prev, { step: step + 1, keystream: keystreamBit }])
      updateExplanation(updatedState, keystreamBit)
      return updatedState
    })
  }

  const updateExplanation = (newState: number[], keystreamBit: number) => {
    const t1 = newState[65] ^ newState[92]
    const t2 = newState[161] ^ newState[176]
    const t3 = newState[242] ^ newState[287]
    setExplanation(`
      Step ${step + 1}:
      t1 = s[66] ⊕ s[93] = ${newState[65]} ⊕ ${newState[92]} = ${t1}
      t2 = s[162] ⊕ s[177] = ${newState[161]} ⊕ ${newState[176]} = ${t2}
      t3 = s[243] ⊕ s[288] = ${newState[242]} ⊕ ${newState[287]} = ${t3}
      Keystream bit = t1 ⊕ t2 ⊕ t3 = ${t1} ⊕ ${t2} ⊕ ${t3} = ${keystreamBit}
      
      New bits inserted:
      s[1] = t3 ⊕ (s[286] ∧ s[287]) ⊕ s[69] = ${t3} ⊕ (${newState[285]} ∧ ${newState[286]}) ⊕ ${newState[68]} = ${newState[0]}
      s[94] = t1 ⊕ (s[91] ∧ s[92]) ⊕ s[171] = ${t1} ⊕ (${newState[90]} ∧ ${newState[91]}) ⊕ ${newState[170]} = ${newState[93]}
      s[178] = t2 ⊕ (s[175] ∧ s[176]) ⊕ s[264] = ${t2} ⊕ (${newState[174]} ∧ ${newState[175]}) ⊕ ${newState[263]} = ${newState[177]}
    `)
  }

  const drawState = useCallback(() => {
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

        // Draw labels for key positions
        if ((i === 0 && j === 65) || (i === 0 && j === 92) ||
            (i === 1 && j === 68) || (i === 1 && j === 83) ||
            (i === 2 && j === 65) || (i === 2 && j === 110)) {
          ctx.fillStyle = '#000000'
          ctx.font = '10px Arial'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(`s[${bitIndex + 1}]`, x * 1.1, y * 1.1)
        }
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
  }, [state])

  const drawOperation = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, symbol: string) => {
    ctx.fillStyle = color
    ctx.font = '16px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(symbol, x, y)
  }

  const handlePlayPause = () => setIsRunning(!isRunning)
  const handleStep = () => updateState()
  const handleReset = () => initializeState()
  const handleSpeedChange = (value: number[]) => setSpeed(1000 - value[0])
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value)
  const handleIVChange = (e: React.ChangeEvent<HTMLInputElement>) => setIV(e.target.value)
  const handlePresetChange = (value: string) => {
    const preset = PRE_GENERATED_KEYS.find(p => p.label === value)
    if (preset) {
      setKey(preset.key)
      setIV(preset.iv)
    }
  }

  const handleStepBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      setState(history[historyIndex - 1])
      setStep(prev => prev - 1)
      setKeystream(prev => prev.slice(0, -1))
      setPerformanceData(prev => prev.slice(0, -1))
    }
  }

  const handleStepForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      setState(history[historyIndex + 1])
      setStep(prev => prev + 1)
      updateState()
    } else {
      updateState()
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Advanced Trivium State Visualization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas ref={canvasRef} width={600} height={600} className="border rounded-lg" />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handlePlayPause}>
            {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={handleStepBack}>
            <Rewind className="mr-2 h-4 w-4" />
            Step Back
          </Button>
          <Button onClick={handleStepForward}>
            <StepForward className="mr-2 h-4 w-4" />
            Step Forward
          </Button>
          <Button onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="speed">Simulation Speed</Label>
          <Slider
            id="speed"
            min={0}
            max={990}
            step={10}
            value={[1000 - speed]}
            onValueChange={handleSpeedChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preset">Pre-generated Keys</Label>
          <Select onValueChange={handlePresetChange}>
            <SelectTrigger id="preset">
              <SelectValue placeholder="Select a pre-generated key" />
            </SelectTrigger>
            <SelectContent>
              {PRE_GENERATED_KEYS.map((preset) => (
                <SelectItem key={preset.label} value={preset.label}>{preset.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="key">Key (80 bits, hex)</Label>
            <Input id="key" value={key} onChange={handleKeyChange} />
          </div>
          <div>
            <Label htmlFor="iv">IV (80 bits, hex)</Label>
            <Input id="iv" value={iv} onChange={handleIVChange} />
          </div>
        </div>
        <Tabs defaultValue="state" className="w-full">
          <TabsList>
            <TabsTrigger value="state">Current State</TabsTrigger>
            <TabsTrigger value="keystream">Keystream</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="state">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Trivium State (step {step})</AlertTitle>
              <AlertDescription>
                <div className="font-mono text-xs break-all">
                  {state.map((bit, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className={bit ? 'text-green-600' : 'text-red-600'}>
                            {bit}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Bit {index + 1} in Register {Math.floor(index / 93) + 1}</p>
                          <p>Value: {bit}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="keystream">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Generated Keystream</AlertTitle>
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
              <AlertTitle>Current Step Explanation</AlertTitle>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-xs">{explanation}</pre>
              </AlertDescription>
            </Alert>
          </TabsContent>
          <TabsContent value="performance">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="step" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="keystream" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Key Points for Professors:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Trivium uses three non-linear feedback shift registers (NFSR) of lengths 93, 84, and 111 bits, represented by different colors in the visualization.</li>
            <li>The total internal state is 288 bits (93 + 84 + 111).</li>
            <li>Basic operations are XOR (⊕) and AND (∧), making Trivium efficient in hardware. These operations are highlighted in the visualization.</li>
            <li>The initialization phase (first 1152 steps) ensures complete diffusion of the key and IV.</li>
            <li>After initialization, each step produces one keystream bit.</li>
            <li>The security of Trivium relies on the difficulty of predicting the internal state from the observed keystream.</li>
            <li>This visualization allows for step-by-step analysis of Trivium's operation, ideal for educational purposes.</li>
            <li>The performance graph shows the generated keystream over time, helping to visualize patterns or lack thereof in the output.</li>
          </ul>
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Legend:</h3>
          <div className="flex flex-wrap gap-4">
            {REGISTER_COLORS.map((color, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-6 h-6 rounded-full mr-2`} style={{ backgroundColor: color }}></div>
                <span>Register {index + 1} ({index === 0 ? '93' : index === 1 ? '84' : '111'} bits)</span>
              </div>
            ))}
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center`} style={{ backgroundColor: XOR_COLOR }}>⊕</div>
              <span>XOR Operation</span>
            </div>
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center`} style={{ backgroundColor: AND_COLOR }}>∧</div>
              <span>AND Operation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

