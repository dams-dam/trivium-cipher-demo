'use client'

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import KeyGeneration from './KeyGeneration'
import Encryption from './Encryption'
import Decryption from './Decryption'
import TriviumVisualization from './TriviumVisualization'
import TriviumAnalysis from './TriviumAnalysis'
import TriviumIntroduction from './TriviumIntroduction'
import TriviumPerformanceAnalysis from './TriviumPerformanceAnalysis'
import ComprehensiveBankingDemo from './ComprehensiveBankingDemo'
import TriviumMathBackground from './TriviumMathBackground'
import References from './References'
import { initializeTrivium } from '../lib/trivium'

export interface TriviumState {
  key: string;
  iv: string;
  state?: number[];
}

const steps = [
  { id: 'intro', title: '1. Introduction', recommendation: "Start here to understand Trivium's basics and its place in cryptography." },
  { id: 'math', title: '2. Mathematical Background', recommendation: "Dive into the mathematical foundations that make Trivium secure and efficient." },
  { id: 'keygen', title: '3. Key Generation', recommendation: "Explore how Trivium generates and uses its 80-bit key and IV." },
  { id: 'encrypt', title: '4. Encryption', recommendation: 'See Trivium in action by encrypting the message "Hello, Professor!"' },
  { id: 'decrypt', title: '5. Decryption', recommendation: "Observe how Trivium decrypts the message, demonstrating the cipher's reversibility." },
  { id: 'visualize', title: '6. Visualization', recommendation: "This visual representation helps understand Trivium's internal state changes." },
  { id: 'banking', title: '7. Comprehensive Banking Demo', recommendation: "Experience a detailed, step-by-step application of Trivium in a simulated secure banking scenario." },
  { id: 'analyze', title: '8. Security Analysis', recommendation: "Understand Trivium's strengths and potential vulnerabilities in cryptographic context." },
  { id: 'performance', title: '9. Performance', recommendation: "Evaluate Trivium's efficiency with different input sizes, showcasing its suitability for various applications." },
  { id: 'references', title: '10. References', recommendation: "Explore academic papers and resources for a deeper understanding of Trivium and stream ciphers." },
]

export default function TriviumDemo() {
  const [triviumState, setTriviumState] = useState<TriviumState>({ key: '', iv: '' })
  const [currentStep, setCurrentStep] = useState(0)

  const updateTriviumState = useCallback((newState: { key: string; iv: string }) => {
    setTriviumState(prevState => {
      const internalState = initializeTrivium(newState.key, newState.iv)
      return { ...newState, state: internalState }
    })
  }, [])

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader className="border-b">
        <CardTitle>Trivium Cipher Demonstration</CardTitle>
        <CardDescription>A comprehensive guide to understanding and implementing the Trivium stream cipher</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {steps.map((step, index) => (
              <Button
                key={step.id}
                variant={index === currentStep ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(index)}
              >
                {step.title}
              </Button>
            ))}
          </div>
        </div>

        <Alert className="mb-6">
          <AlertTitle>Recommendation for Professor</AlertTitle>
          <AlertDescription>{steps[currentStep].recommendation}</AlertDescription>
        </Alert>

        {currentStep === 0 && <TriviumIntroduction />}
        {currentStep === 1 && <TriviumMathBackground />}
        {currentStep === 2 && <KeyGeneration onKeyGenerated={updateTriviumState} />}
        {currentStep === 3 && <Encryption triviumState={triviumState} />}
        {currentStep === 4 && <Decryption triviumState={triviumState} />}
        {currentStep === 5 && <TriviumVisualization triviumState={triviumState} />}
        {currentStep === 6 && <ComprehensiveBankingDemo />}
        {currentStep === 7 && <TriviumAnalysis />}
        {currentStep === 8 && <TriviumPerformanceAnalysis />}
        {currentStep === 9 && <References />}

        <div className="flex justify-between mt-6">
          <Button onClick={prevStep} disabled={currentStep === 0} variant="outline">Previous</Button>
          <Button onClick={nextStep} disabled={currentStep === steps.length - 1}>Next</Button>
        </div>
      </CardContent>
    </Card>
  )
}

