import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { StepIndicator } from "@/components/dental/StepIndicator";
import { AdPreview } from "@/components/dental/AdPreview";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const STEPS = ["Practice Info", "Keywords", "Preview"];
const SERVICES = ["General Dentistry", "Preventive Care", "Cosmetic Dentistry", "Restorative Dentistry", "Dental Implants", "Orthodontics", "Pediatric Dentistry", "Gum Care", "Oral Surgery", "Emergency Dentistry", "Specialty Services"];

interface FormData {
  practiceName: string;
  website: string;
  service: string;
  location: string;
  email?: string;
  keywords: string[];
}

type DentalPractice = Database['public']['Tables']['dental_practices']['Insert'];

export default function DentalAdGenerate() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<{
    headlines: string[];
    descriptions: string[];
    url: string;
  } | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      keywords: ["", "", ""]
    }
  });

  const handlePrevious = () => {
    setGeneratedAd(null);
    setShowEmailDialog(false);
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const onSubmit = async (data: FormData) => {
    if (!data.service) {
      toast({
        title: "Error",
        description: "Please select a service",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Generating ad with data:", {
        practiceName: data.practiceName,
        website: data.website,
        selectedServices: [data.service],
        location: data.location,
        keywords: data.keywords.filter(Boolean)
      });

      const { data: adData, error } = await supabase.functions.invoke<{
        headlines: string[];
        descriptions: string[];
        url: string;
      }>('generate-dental-ad', {
        body: {
          practiceName: data.practiceName,
          website: data.website,
          selectedServices: [data.service],
          location: data.location,
          keywords: data.keywords.filter(Boolean)
        }
      });

      console.log("Edge function response:", { adData, error });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      if (!adData || !adData.headlines || !adData.descriptions) {
        throw new Error("Invalid response from ad generator");
      }

      setGeneratedAd(adData);

      // Only handle email submission if the dialog is open
      if (showEmailDialog && data.email) {
        const practiceData: DentalPractice = {
          practice_name: data.practiceName,
          email: data.email,
          website: data.website,
          services: [data.service],
          location: data.location,
          phone: null
        };
        
        console.log("Saving practice data:", practiceData);
        const { error: dbError } = await supabase.from('dental_practices').insert(practiceData);
        
        if (dbError) {
          console.error("Database error:", dbError);
          throw dbError;
        }

        toast({
          title: "Success!",
          description: "Your Google Ad has been generated and practice info saved."
        });
        setShowEmailDialog(false);
      } else if (!showEmailDialog) {
        setShowEmailDialog(true);
      }
    } catch (error) {
      console.error('Error in ad generation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate ad. Please try again.",
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
              <img src="/lovable-uploads/b3267bc4-a988-4b24-9076-8eae1d042ef9.png" alt="Grovio Logo" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-grovio-lime to-grovio-teal bg-clip-text text-transparent">
              Dental Google Ad Generator
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600"></CardDescription>
          </CardHeader>
          <CardContent>
            <StepIndicator currentStep={currentStep} steps={STEPS} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 0 && <div className="space-y-4 animate-fadeIn">
                  <div>
                    <Label htmlFor="practiceName">Practice Name</Label>
                    <Input id="practiceName" {...register("practiceName", { required: true })} className="mt-1" placeholder="Enter your practice name" />
                    {errors.practiceName && <span className="text-sm text-red-500">Practice name is required</span>}
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" type="url" {...register("website", { required: true })} className="mt-1" placeholder="https://www.yourpractice.com" />
                    {errors.website && <span className="text-sm text-red-500">Website is required</span>}
                  </div>
                  <div>
                    <Label htmlFor="location">Where are your potential patients?</Label>
                    <Input id="location" {...register("location", { required: true })} className="mt-1" placeholder="e.g., Downtown Seattle, WA" />
                    {errors.location && <span className="text-sm text-red-500">Location is required</span>}
                  </div>
                  <div>
                    <Label htmlFor="service">Select Your Preferred Service to Promote</Label>
                    <Select onValueChange={value => setValue("service", value)}>
                      <SelectTrigger id="service" className="mt-1">
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map(service => <SelectItem key={service} value={service} className="cursor-pointer">
                            {service}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>}

              {currentStep === 1 && <div className="space-y-4 animate-fadeIn">
                  <div>
                    <Label>Keywords (up to 3)</Label>
                    <div className="grid grid-cols-1 gap-4">
                      {[0, 1, 2].map(index => <Input key={index} {...register(`keywords.${index}`)} placeholder={`Keyword ${index + 1}`} className="mt-1" />)}
                    </div>
                  </div>
                </div>}

              {currentStep === 2 && <div className="animate-fadeIn">
                  {generatedAd ? (
                    <AdPreview {...generatedAd} />
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Ready to generate your ad
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Click generate to create your optimized Google Ad
                      </p>
                    </div>
                  )}
                </div>}

              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 0} className="border-grovio-teal text-grovio-teal hover:bg-grovio-teal/10">
                  Previous
                </Button>
                {currentStep < 2 ? <Button type="button" onClick={() => {
                if (currentStep === 0 && !watch("service")) {
                  toast({
                    title: "Error",
                    description: "Please select a service",
                    variant: "destructive"
                  });
                  return;
                }
                setCurrentStep(prev => Math.min(2, prev + 1));
              }} className="bg-gradient-to-r from-grovio-lime to-grovio-teal text-white hover:opacity-90">
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

      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your Ad</DialogTitle>
            <DialogDescription>
              Enter your email to save your generated ad and receive future updates
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmailDialog(false)}
              >
                Skip
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isGenerating}
                className="bg-gradient-to-r from-grovio-lime to-grovio-teal text-white hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save Ad"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}
