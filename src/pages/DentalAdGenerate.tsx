
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";
import { StepIndicator } from "@/components/dental/StepIndicator";
import { AdPreview } from "@/components/dental/AdPreview";
import { PracticeInfoForm } from "@/components/dental/PracticeInfoForm";
import { ServicesSelection } from "@/components/dental/ServicesSelection";
import { KeywordsForm } from "@/components/dental/KeywordsForm";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type FormData } from "@/components/dental/schema";
import { STEPS, type DentalPracticeCreate, type DentalPracticeUpdate, type GeneratedAd } from "@/types/dental";

export default function DentalAdGenerate() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [practiceId, setPracticeId] = useState<string | null>(null);
  const [generatedAd, setGeneratedAd] = useState<GeneratedAd | null>(null);

  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: ["", "", ""],
    },
  });

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : prev.length < 3
        ? [...prev, service]
        : prev
    );
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

  const savePracticeInfo = async (data: DentalPracticeCreate | DentalPracticeUpdate) => {
    try {
      if (practiceId) {
        const { error } = await supabase
          .from('dental_practices')
          .update(data)
          .eq('id', practiceId);
        
        if (error) throw error;
      } else {
        const fullData = data as DentalPracticeCreate;
        const { data: newPractice, error } = await supabase
          .from('dental_practices')
          .insert([fullData])
          .select('id')
          .single();
        
        if (error) throw error;
        setPracticeId(newPractice.id);
      }

      toast({
        title: "Success",
        description: "Progress saved successfully",
      });
      return true;
    } catch (error) {
      console.error('Error saving practice info:', error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    if (selectedServices.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one service",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const keywords = data.keywords.filter(Boolean);
      
      const { data: adData, error } = await supabase.functions.invoke<GeneratedAd>('generate-dental-ad', {
        body: {
          practiceName: data.practiceName,
          email: data.email,
          phone: data.phone,
          website: data.website,
          selectedServices,
          keywords,
        },
      });

      if (error) throw error;
      setGeneratedAd(adData);
      
      toast({
        title: "Success!",
        description: "Your Google Ad has been generated.",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PracticeInfoForm
            register={register}
            errors={errors}
            formatPhoneNumber={formatPhoneNumber}
          />
        );
      case 1:
        return (
          <ServicesSelection
            selectedServices={selectedServices}
            onServiceToggle={handleServiceToggle}
          />
        );
      case 2:
        return <KeywordsForm register={register} />;
      case 3:
        return generatedAd ? (
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Dental Google Ad Generator
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              Create optimized Google Ads for your dental practice in minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StepIndicator currentStep={currentStep} steps={STEPS} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={async () => {
                      if (currentStep === 0) {
                        const practiceInfo = watch();
                        const isValid = !errors.practiceName && 
                                      !errors.email && 
                                      !errors.phone && 
                                      !errors.website &&
                                      practiceInfo.practiceName &&
                                      practiceInfo.email &&
                                      practiceInfo.phone &&
                                      practiceInfo.website;
                        
                        if (!isValid) {
                          toast({
                            title: "Error",
                            description: "Please fill out all required fields correctly",
                            variant: "destructive",
                          });
                          return;
                        }

                        const saveSuccess = await savePracticeInfo({
                          practice_name: practiceInfo.practiceName,
                          email: practiceInfo.email,
                          phone: practiceInfo.phone,
                          website: practiceInfo.website,
                          services: [],
                        });

                        if (!saveSuccess) return;
                      }
                      
                      if (currentStep === 1) {
                        if (selectedServices.length === 0) {
                          toast({
                            title: "Error",
                            description: "Please select at least one service",
                            variant: "destructive",
                          });
                          return;
                        }

                        const saveSuccess = await savePracticeInfo({
                          services: selectedServices,
                        });

                        if (!saveSuccess) return;
                      }
                      
                      setCurrentStep((prev) => Math.min(3, prev + 1));
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      "Generate Ad"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
