import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { StepIndicator } from "@/components/dental/StepIndicator";
import { ServiceCard } from "@/components/dental/ServiceCard";
import { AdPreview } from "@/components/dental/AdPreview";
import { supabase } from "@/integrations/supabase/client";
const STEPS = ["Practice Info", "Services", "Keywords", "Preview"];
const SERVICES = [{
  name: "General Dentistry",
  description: "Comprehensive dental care for the whole family"
}, {
  name: "Preventive Care",
  description: "Regular checkups and cleanings to maintain oral health"
}, {
  name: "Cosmetic Dentistry",
  description: "Transform your smile with aesthetic dental procedures"
}, {
  name: "Restorative Dentistry",
  description: "Repair and restore damaged or missing teeth"
}, {
  name: "Dental Implants",
  description: "Permanent solution for missing teeth"
}, {
  name: "Orthodontics",
  description: "Straighten teeth and correct bite issues"
}, {
  name: "Pediatric Dentistry",
  description: "Specialized dental care for children"
}, {
  name: "Gum Care",
  description: "Treatment for periodontal disease and gum health"
}, {
  name: "Oral Surgery",
  description: "Surgical procedures for complex dental issues"
}, {
  name: "Emergency Dentistry",
  description: "Immediate care for dental emergencies"
}, {
  name: "Specialty Services",
  description: "Advanced dental procedures and treatments"
}];
interface FormData {
  practiceName: string;
  email: string;
  phone: string;
  website: string;
  keywords: string[];
}
interface DentalPractice {
  practice_name: string;
  email: string;
  phone: string;
  website: string;
  services: string[];
}
export default function DentalAdGenerate() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<{
    headlines: string[];
    descriptions: string[];
    url: string;
  } | null>(null);
  const {
    toast
  } = useToast();
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<FormData>({
    defaultValues: {
      keywords: ["", "", ""]
    }
  });
  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => prev.includes(service) ? prev.filter(s => s !== service) : prev.length < 3 ? [...prev, service] : prev);
  };
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 6) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 3) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    return digits;
  };
  const onSubmit = async (data: FormData) => {
    if (selectedServices.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one service",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    try {
      const keywords = data.keywords.filter(Boolean);
      const {
        data: adData,
        error
      } = await supabase.functions.invoke<{
        headlines: string[];
        descriptions: string[];
        url: string;
      }>('generate-dental-ad', {
        body: {
          practiceName: data.practiceName,
          email: data.email,
          phone: data.phone,
          website: data.website,
          selectedServices,
          keywords
        }
      });
      if (error) throw error;
      const practiceData: DentalPractice = {
        practice_name: data.practiceName,
        email: data.email,
        phone: data.phone,
        website: data.website,
        services: selectedServices
      };
      const {
        error: dbError
      } = await supabase.from('dental_practices').insert([practiceData]);
      if (dbError) throw dbError;
      setGeneratedAd(adData);
      toast({
        title: "Success!",
        description: "Your Google Ad has been generated and practice info saved."
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate ad. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  return <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center relative pb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img alt="Grovio Logo" className="h-12 w-auto" src="/lovable-uploads/83e3fcc9-e4fb-427f-a576-40023d33ab83.png" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-grovio-lime to-grovio-teal bg-clip-text text-transparent">
              Dental Google Ad Generator
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              Grow your vision with precision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepIndicator currentStep={currentStep} steps={STEPS} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 0 && <div className="space-y-4 animate-fadeIn">
                  <div>
                    <Label htmlFor="practiceName">Practice Name</Label>
                    <Input id="practiceName" {...register("practiceName", {
                  required: true
                })} className="mt-1" placeholder="Enter your practice name" />
                    {errors.practiceName && <span className="text-sm text-red-500">
                        Practice name is required
                      </span>}
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" type="url" {...register("website", {
                  required: true
                })} className="mt-1" placeholder="https://www.yourpractice.com" />
                    {errors.website && <span className="text-sm text-red-500">
                        Website is required
                      </span>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })} className={`mt-1 ${errors.email ? 'border-red-500' : ''}`} placeholder="example@domain.com" />
                    {errors.email && <span className="text-sm text-red-500">
                        {errors.email.message}
                      </span>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone * (XXX-XXX-XXXX)</Label>
                    <Input id="phone" {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{3}-\d{3}-\d{4}$/,
                    message: "Phone must match format: XXX-XXX-XXXX"
                  }
                })} className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`} placeholder="555-555-5555" onChange={e => {
                  e.target.value = formatPhoneNumber(e.target.value);
                }} />
                    {errors.phone && <span className="text-sm text-red-500">
                        {errors.phone.message}
                      </span>}
                  </div>
                </div>}

              {currentStep === 1 && <div className="animate-fadeIn">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Select up to 3 services
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SERVICES.map(service => <ServiceCard key={service.name} service={service.name} description={service.description} selected={selectedServices.includes(service.name)} onClick={() => handleServiceToggle(service.name)} />)}
                  </div>
                </div>}

              {currentStep === 2 && <div className="space-y-4 animate-fadeIn">
                  <div>
                    <Label>Keywords (up to 3)</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {[0, 1, 2].map(index => <Input key={index} {...register(`keywords.${index}`)} placeholder={`Keyword ${index + 1}`} className="mt-1" />)}
                    </div>
                  </div>
                </div>}

              {currentStep === 3 && <div className="animate-fadeIn">
                  {generatedAd ? <AdPreview {...generatedAd} /> : <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Ready to generate your ad
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Click generate to create your optimized Google Ad
                      </p>
                    </div>}
                </div>}

              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="border-grovio-teal text-grovio-teal hover:bg-grovio-teal/10">
                  Previous
                </Button>
                {currentStep < 3 ? <Button type="button" onClick={() => {
                const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
                const email = (document.getElementById('email') as HTMLInputElement)?.value;
                const phone = (document.getElementById('phone') as HTMLInputElement)?.value;
                if (currentStep === 0) {
                  if (!email || !emailRegex.test(email)) {
                    toast({
                      title: "Error",
                      description: "Please enter a valid email address",
                      variant: "destructive"
                    });
                    return;
                  }
                  if (!phone || !phoneRegex.test(phone)) {
                    toast({
                      title: "Error",
                      description: "Please enter a valid phone number (XXX-XXX-XXXX)",
                      variant: "destructive"
                    });
                    return;
                  }
                }
                setCurrentStep(prev => Math.min(3, prev + 1));
              }} disabled={currentStep === 1 && selectedServices.length === 0} className="bg-gradient-to-r from-grovio-lime to-grovio-teal text-white hover:opacity-90">
                    Next
                  </Button> : <Button type="submit" disabled={isGenerating} className="bg-gradient-to-r from-grovio-lime to-grovio-teal text-white hover:opacity-90">
                    {isGenerating ? <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </> : "Generate Ad"}
                  </Button>}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>;
}