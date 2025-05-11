"use client"
import React, { useState } from 'react'
import LogoTitle from './_components/LogoTitle'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Wand2 } from 'lucide-react'
import LogoDesc from './_components/LogoDesc'
import LogoColorPalette from './_components/LogoColorPalette'
import LogoDesigns from './_components/LogoDesigns'
import LogoIdea from './_components/LogoIdea'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const CreateLogo = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState()
  const [ideaGenerated, setIdeaGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerateIdeas = () => {
    // Mark that generation has been triggered
    setIdeaGenerated(true)
  }

  const proceedToResult = () => {
    // Make sure we've stored the formData in localStorage
    if (formData) {
      localStorage.setItem('formData', JSON.stringify(formData))
      router.push('/result')
    }
  }

  return (
    <div className='mt- p-10 border rounded-xl 2xl:mx-72'>
      {step === 1 ? (
        <LogoTitle
          onHandleInputChange={v => onHandleInputChange('title', v)}
          formData={formData}
        />
      ) : step === 2 ? (
        <LogoDesc
          onHandleInputChange={v => onHandleInputChange('desc', v)}
          formData={formData}
        />
      ) : step === 3 ? (
        <LogoColorPalette
          onHandleInputChange={v => onHandleInputChange('palette', v)}
          formData={formData}
        />
      ) : step === 4 ? (
        <LogoDesigns
          onHandleInputChange={v => onHandleInputChange('design', v)}
          formData={formData}
        />
      ) : step === 5 ? (
        <LogoIdea
          onHandleInputChange={v => onHandleInputChange('idea', v)}
          formData={formData}
          triggerGeneration={ideaGenerated}
        />
      ) : null}

      <div className='flex items-center justify-between mt-10'>
        {step !== 1 && (
          <Button variant='outline' onClick={() => setStep(step - 1)}>
            <ArrowLeft /> Previous
          </Button>
        )}

        {step === 5 ? (
          <>
            {!ideaGenerated ? (
              <Button 
                className='bg-[#ed1e61]' 
                onClick={handleGenerateIdeas}
                disabled={loading}
              >
                <Wand2 className='mr-2' /> Generate Ideas
              </Button>
            ) : (
              <Button 
                className='bg-[#ed1e61]' 
                onClick={proceedToResult}
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <Wand2 className='mr-2' />
                )} 
                Create Logo
              </Button>
            )}
          </>
        ) : (
          <Button onClick={() => setStep(step + 1)} className='bg-[#ed1e61]'>
            <ArrowRight /> Continue
          </Button>
        )}
      </div>
    </div>
  )
}

export default CreateLogo