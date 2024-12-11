import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function TriviumExplanation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Understanding the Trivium Cipher</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="what-is-trivium">
            <AccordionTrigger>What is Trivium?</AccordionTrigger>
            <AccordionContent>
              <p>Trivium is a synchronous stream cipher designed to generate up to 2^64 bits of keystream from an 80-bit secret key and an 80-bit initialization vector (IV). It was designed to be simple, efficient, and suitable for hardware implementation.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="key-features">
            <AccordionTrigger>Key Features of Trivium</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Simple design with only 3 shift registers</li>
                <li>80-bit key and 80-bit IV</li>
                <li>Internal state of 288 bits</li>
                <li>Generates up to 2^64 bits of keystream</li>
                <li>Efficient in both software and hardware implementations</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="trivium-process">
            <AccordionTrigger>Trivium Encryption Process</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Initialize the 288-bit internal state using the key and IV</li>
                <li>Perform 1152 rounds of state update (4 full cycles) without producing output</li>
                <li>For each bit of plaintext:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Generate a keystream bit</li>
                    <li>XOR the keystream bit with the plaintext bit to produce a ciphertext bit</li>
                    <li>Update the internal state</li>
                  </ul>
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="security">
            <AccordionTrigger>Security of Trivium</AccordionTrigger>
            <AccordionContent>
              <p>Trivium has withstood cryptanalysis well since its introduction in 2005. Its security is based on the difficulty of recovering the internal state or the secret key from the keystream. However, like all stream ciphers, it's crucial to never reuse a key-IV pair, as this can lead to devastating attacks on the encrypted data.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

