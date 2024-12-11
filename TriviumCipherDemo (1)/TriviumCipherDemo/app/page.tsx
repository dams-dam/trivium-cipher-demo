import TriviumDemo from '../components/TriviumDemo'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-50">
      <div className="z-10 w-full items-center justify-between font-mono text-sm">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-8 text-center text-gray-800">
          Trivium Cipher Demonstration
        </h1>
        <p className="mb-4 text-center text-sm md:text-base text-gray-600">
          A comprehensive guide to understanding and implementing the Trivium stream cipher
        </p>
        <TriviumDemo />
      </div>
    </main>
  )
}

