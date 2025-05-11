"use client"
import React, { useState, useEffect } from 'react'
import LogoTitle from './_components/LogoTitle'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Wand2 } from 'lucide-react'
import LogoDesc from './_components/LogoDesc'
import LogoColorPalette from './_components/LogoColorPalette'
import LogoDesigns from './_components/LogoDesigns'
import LogoIdea from './_components/LogoIdea'
import { useRouter } from 'next/navigation'

const CreateLogo = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [ideaGenerated, setIdeaGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Load formData from localStorage if it exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('formData')
      if (storedData) {
        try {
          setFormData(JSON.parse(storedData))
        } catch (error) {
          console.error('Error parsing stored form data:', error)
        }
      }
    }
  }, [])

  const onHandleInputChange = (field, value) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    }
    setFormData(updatedFormData)
    
    // Save to localStorage whenever formData changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('formData', JSON.stringify(updatedFormData))
    }
  }

  const handleGenerateIdeas = () => {
    // Mark that generation has been triggered
    setIdeaGenerated(true)
  }

  const proceedToResult = () => {
    // Store the final formData in localStorage
    if (formData && Object.keys(formData).length > 0) {
      localStorage.setItem('formData', JSON.stringify(formData))
      
      // Navigate to the result page
      router.push('/Generate-Logo')
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title && formData.title.trim() !== ''
      case 2:
        return formData.desc && formData.desc.trim() !== ''
      case 3:
        return formData.palette
      case 4:
        return formData.design && formData.design.title
      case 5:
        return true // Allow proceeding from step 5 regardless
      default:
        return true
    }
  }

  return (
    <div className='mt-4 p-10 border rounded-xl 2xl:mx-72'>
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
            <ArrowLeft className="mr-2" /> Previous
          </Button>
        )}

        {step === 5 ? (
          <>
            {!ideaGenerated ? (
              <Button 
                className='bg-[#ed1e61]' 
                onClick={handleGenerateIdeas}
                disabled={loading || !isStepValid()}
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
          <Button 
            onClick={() => setStep(step + 1)} 
            className='bg-[#ed1e61]'
            disabled={!isStepValid()}
          >
            Continue <ArrowRight className="ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default CreateLogo