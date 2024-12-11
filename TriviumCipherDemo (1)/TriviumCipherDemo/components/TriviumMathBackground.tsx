import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TriviumMathBackground() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mathematical Background of Trivium</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="linear-feedback-shift-registers">
            <AccordionTrigger>Linear Feedback Shift Registers (LFSRs)</AccordionTrigger>
            <AccordionContent>
              <p>Trivium's design is inspired by LFSRs, which are used in many stream ciphers. An LFSR is a shift register whose input bit is a linear function of its previous state.</p>
              <p>Mathematically, an LFSR of length n can be described by the following recurrence relation:</p>
              <pre className="bg-gray-100 p-2 rounded-md mt-2">
                s[n+i] = c[1]s[i] ⊕ c[2]s[i+1] ⊕ ... ⊕ c[n]s[i+n-1]
              </pre>
              <p className="mt-2">Where s[i] is the i-th state bit, and c[j] are fixed coefficients in GF(2).</p>
              <p>Key properties of LFSRs:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Produce sequences with long periods (up to 2^n - 1 for an n-bit LFSR)</li>
                <li>Good statistical properties (uniform distribution of 0s and 1s)</li>
                <li>Can be efficiently implemented in hardware</li>
                <li>Their behavior can be analyzed using algebraic techniques</li>
              </ul>
              <p>Trivium uses three interconnected nonlinear feedback shift registers to overcome the vulnerabilities of simple LFSRs.</p>
              <p className="mt-2 text-sm text-gray-600">
                Reference: Golomb, S. W. (1967). Shift register sequences. Holden-Day, Inc.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="boolean-functions">
            <AccordionTrigger>Boolean Functions in Trivium</AccordionTrigger>
            <AccordionContent>
              <p>Trivium uses simple boolean functions to update its internal state and generate keystream bits:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>XOR (⊕): Used for combining bits from different registers</li>
                <li>AND (∧): Used in the nonlinear feedback function</li>
              </ul>
              <p>The state update function for each register i can be represented as:</p>
              <pre className="bg-gray-100 p-2 rounded-md mt-2">
                s[i] = s[i-1] ⊕ (s[i-x] ∧ s[i-y]) ⊕ s[i-z]
              </pre>
              <p className="mt-2">Where:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>s[i] represents the i-th bit of the state</li>
                <li>x, y, and z are specific tap positions for each register</li>
                <li>⊕ represents the XOR operation</li>
                <li>∧ represents the AND operation</li>
              </ul>
              <p>The algebraic normal form (ANF) of this function is:</p>
              <pre className="bg-gray-100 p-2 rounded-md mt-2">
                s[i] = s[i-1] ⊕ s[i-x]s[i-y] ⊕ s[i-z]
              </pre>
              <p className="mt-2">This combination of linear (XOR) and nonlinear (AND) operations contributes to Trivium's security by increasing the algebraic complexity of the state update function.</p>
              <p className="mt-2 text-sm text-gray-600">
                Reference: Canteaut, A. (2016). Lecture notes on cryptographic Boolean functions. Inria Paris, France.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="algebraic-degree">
            <AccordionTrigger>Algebraic Degree and Nonlinearity</AccordionTrigger>
            <AccordionContent>
              <p>The security of Trivium relies on the nonlinearity introduced by the AND operations in its state update function.</p>
              <p>Key concepts:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Algebraic degree: The highest degree term in the algebraic normal form of the boolean function</li>
                <li>Nonlinearity: A measure of how different a boolean function is from all affine functions</li>
              </ul>
              <p>For a boolean function f, its nonlinearity is defined as:</p>
              <pre className="bg-gray-100 p-2 rounded-md mt-2">
                NL(f) = 2^(n-1) - 1/2 * max|F(a)|
              </pre>
              <p className="mt-2">Where:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>NL(f) is the nonlinearity of function f</li>
                <li>n is the number of variables in the boolean function</li>
                <li>F(a) is the Walsh-Hadamard transform of f</li>
                <li>max|F(a)| is the maximum absolute value of F(a) over all inputs a</li>
              </ul>
              <p>Trivium's design ensures that the algebraic degree of the state bits increases rapidly with each round, making algebraic attacks more difficult.</p>
              <p className="mt-2 text-sm text-gray-600">
                Reference: Carlet, C. (2010). Boolean functions for cryptography and error correcting codes. Boolean models and methods in mathematics, computer science, and engineering, 2, 257-397.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="period-and-state-space">
            <AccordionTrigger>Period and State Space</AccordionTrigger>
            <AccordionContent>
              <p>Trivium has a large internal state of 288 bits, which contributes to its security:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Total possible states: 2^288 ≈ 4.8 × 10^86</li>
                <li>Designed to have a period of at least 2^64 bits</li>
              </ul>
              <p>The large state space makes it infeasible for an attacker to enumerate all possible states or predict the internal state from observed keystream bits.</p>
              <p>The period of Trivium is related to the periods of its constituent nonlinear feedback shift registers. For a single NFSR of length n, the maximum period is 2^n - 1. Trivium's design aims to achieve a period close to the product of its register lengths:</p>
              <pre className="bg-gray-100 p-2 rounded-md mt-2">
                Period ≈ (2^93 - 1) * (2^84 - 1) * (2^111 - 1)
              </pre>
              <p className="mt-2">This results in a period much larger than the 2^64 bits that Trivium is designed to generate, providing a significant security margin.</p>
              <p className="mt-2 text-sm text-gray-600">
                Reference: De Cannière, C., & Preneel, B. (2005). Trivium. In New Stream Cipher Designs (pp. 244-266). Springer, Berlin, Heidelberg.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

