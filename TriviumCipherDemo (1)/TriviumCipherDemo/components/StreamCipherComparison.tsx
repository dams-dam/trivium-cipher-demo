import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function StreamCipherComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison with Other Stream Ciphers</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Trivium is one of several modern stream ciphers. Let's compare it with other well-known ciphers:</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead>Trivium</TableHead>
              <TableHead>ChaCha20</TableHead>
              <TableHead>RC4</TableHead>
              <TableHead>A5/1 (GSM)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Key Size</TableCell>
              <TableCell>80 bits</TableCell>
              <TableCell>256 bits</TableCell>
              <TableCell>40-2048 bits</TableCell>
              <TableCell>64 bits</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IV Size</TableCell>
              <TableCell>80 bits</TableCell>
              <TableCell>64 bits</TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>22 bits</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Internal State</TableCell>
              <TableCell>288 bits</TableCell>
              <TableCell>512 bits</TableCell>
              <TableCell>2064 bits</TableCell>
              <TableCell>64 bits</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Design Paradigm</TableCell>
              <TableCell>Nonlinear Feedback Shift Registers</TableCell>
              <TableCell>ARX (Add-Rotate-XOR)</TableCell>
              <TableCell>Variable Length Key Scheduling</TableCell>
              <TableCell>Linear Feedback Shift Registers</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hardware Efficiency</TableCell>
              <TableCell>Excellent</TableCell>
              <TableCell>Good</TableCell>
              <TableCell>Poor</TableCell>
              <TableCell>Excellent</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Software Efficiency</TableCell>
              <TableCell>Good</TableCell>
              <TableCell>Excellent</TableCell>
              <TableCell>Excellent</TableCell>
              <TableCell>Poor</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Security Status</TableCell>
              <TableCell>Considered Secure</TableCell>
              <TableCell>Considered Very Secure</TableCell>
              <TableCell>Broken</TableCell>
              <TableCell>Broken</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-4 space-y-2">
          <p><strong>Key Observations:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Trivium offers a good balance between simplicity, efficiency, and security.</li>
            <li>ChaCha20 provides stronger security but with a more complex design.</li>
            <li>RC4, while efficient, has been broken and is no longer recommended for use.</li>
            <li>A5/1, used in older GSM networks, has significant vulnerabilities and a small state size.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

