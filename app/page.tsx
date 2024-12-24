import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full py-4 border-b">
        <div className="container mx-auto px-4">
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Your Personal Health Assistant
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Track nutrition, plan meals, and achieve your health goals with Food Knowledge Graph (FKG) platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto px-10 py-6 text-lg font-semibold rounded-full">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-10 py-6 text-lg font-semibold rounded-full">
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </main>
      <footer className="w-full py-6 mt-12 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Food Intelligence by Food Knowledge Graph. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

