'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { createCompanyAction } from '@/app/actions'
import { createClient } from '@/utils/supabase/client'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [choice, setChoice] = useState(null)
  const router = useRouter()
//   const supabase = createClient()

//   const handleCreateCompany = async (formData) => {
//     await createCompanyAction(formData)
//   }

    

  const handleNext = () => {
    setStep(2)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <Link href="/" className="text-xl font-bold">
                DocSpire
              </Link>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {step === 1 ? 'Get Started' : choice === 'create' ? 'Create Company' : 'Join Company'}
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            {step === 1
              ? 'Are you creating a new company or joining an existing one?'
              : choice === 'create'
              ? 'Give your company a name to get started.'
              : 'Enter your company’s invite code to join.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <Button
                variant={choice === 'create' ? 'default' : 'outline'}
                onClick={() => setChoice('create')}
              >
                Create a New Company
              </Button>
              <Button
                variant={choice === 'join' ? 'default' : 'outline'}
                onClick={() => setChoice('join')}
              >
                Join an Existing Company
              </Button>
              <Button onClick={handleNext} disabled={!choice} className="mt-2 w-full">
                Continue
              </Button>
            </div>
          )}

          {step === 2 && choice === 'create' && (
            <form action={createCompanyAction} className="space-y-3">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Create Company
              </Button>
            </form>
          )}

          {step === 2 && choice === 'join' && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const code = formData.get('companyCode')
                // TODO: join company logic here
                router.push('/dashboard')
              }}
              className="space-y-3"
            >
              <Label htmlFor="companyCode">Company Code</Label>
              <Input
                id="companyCode"
                name="companyCode"
                onChange={(e) => (e.target.value = e.target.value.toUpperCase())}
                required
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Join Company
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="text-sm text-center">
          <div className="text-gray-600 dark:text-gray-400 mx-auto">
            Need help?{' '}
            <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
