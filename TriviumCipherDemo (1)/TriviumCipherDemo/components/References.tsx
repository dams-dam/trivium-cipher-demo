import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function References() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>References and Further Reading</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Explore these academic papers and resources to deepen your understanding of Trivium and stream ciphers:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            De Cannière, C., & Preneel, B. (2005). Trivium. In New Stream Cipher Designs (pp. 244-266). Springer, Berlin, Heidelberg.
            <br />
            <a href="https://www.ecrypt.eu.org/stream/p3ciphers/trivium/trivium_p3.pdf" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              https://www.ecrypt.eu.org/stream/p3ciphers/trivium/trivium_p3.pdf
            </a>
          </li>
          <li>
            Maximov, A., & Biryukov, A. (2007). Two Trivial Attacks on Trivium. In Selected Areas in Cryptography (pp. 36-55). Springer, Berlin, Heidelberg.
            <br />
            <a href="https://eprint.iacr.org/2007/021.pdf" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              https://eprint.iacr.org/2007/021.pdf
            </a>
          </li>
          <li>
            Fouque, P. A., & Vannet, T. (2013, August). Improving key recovery to 784 and 799 rounds of Trivium using optimized cube attacks. In Fast Software Encryption (pp. 502-517). Springer, Berlin, Heidelberg.
            <br />
            <a href="https://www.iacr.org/archive/fse2013/84240519/84240519.pdf" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              https://www.iacr.org/archive/fse2013/84240519/84240519.pdf
            </a>
          </li>
          <li>
            Liu, M. (2017). Degree evaluation of NFSR-based cryptosystems. In Advances in Cryptology – CRYPTO 2017 (pp. 227-249). Springer, Cham.
            <br />
            <a href="https://eprint.iacr.org/2017/068.pdf" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              https://eprint.iacr.org/2017/068.pdf
            </a>
          </li>
          <li>
            Chakraborty, K., Sarkar, S., Maitra, S., Mazumdar, B., Mukhopadhyay, D., & Prouff, E. (2017). Redefining the transparency order. Designs, Codes and Cryptography, 82(1), 95-115.
            <br />
            <a href="https://eprint.iacr.org/2014/367.pdf" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              https://eprint.iacr.org/2014/367.pdf
            </a>
          </li>
          <li>
            Bernstein, D. J. (2008). The Salsa20 family of stream ciphers. In New stream cipher designs (pp. 84-97). Springer, Berlin, Heidelberg.
            <br />
            <a href="https://cr.yp.to/snuffle/salsafamily-20071225.pdf" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              https://cr.yp.to/snuffle/salsafamily-20071225.pdf
            </a>
          </li>
          <li>
            eSTREAM: the ECRYPT Stream Cipher Project
            <br />
            <a href="https://www.ecrypt.eu.org/stream/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              https://www.ecrypt.eu.org/stream/
            </a>
          </li>
        </ol>
      </CardContent>
    </Card>
  )
}

