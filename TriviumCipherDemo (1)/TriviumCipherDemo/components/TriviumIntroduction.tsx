import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TriviumIntroduction() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Introduction to Trivium</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Trivium is a synchronous stream cipher designed to generate up to 2^64 bits of keystream from an 80-bit secret key and an 80-bit initialization vector (IV). It was created by Christophe De Cannière and Bart Preneel as part of the eSTREAM project.
        </p>
        <h3 className="text-lg font-semibold">Key Features:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Simple design with only 3 shift registers</li>
          <li>80-bit key and 80-bit IV</li>
          <li>Internal state of 288 bits</li>
          <li>Efficient in both software and hardware implementations</li>
          <li>Suitable for environments with limited resources</li>
        </ul>
        <p>
          In this demonstration, we'll walk through the process of key generation, encryption, and decryption using Trivium. We'll also visualize the internal state and analyze its security properties.
        </p>
      </CardContent>
    </Card>
  )
}

