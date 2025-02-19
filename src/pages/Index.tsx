import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, CheckCircle2, Clock, DollarSign, Activity, Users, Building, ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoSlider from "@/components/LogoSlider";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <img 
              src="/lovable-uploads/c210e479-b641-439a-828d-aa2f6c492ee9.png" 
              alt="Grovio Logo" 
              className="h-16 mx-auto mb-8"
            />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Transform Your</span>
              <span className="block bg-gradient-to-r from-grovio-lime to-grovio-teal bg-clip-text text-transparent">
                Dental Practice Growth
              </span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Stop watching empty chairs eat into your profits. Our AI-powered Google Ads generator 
              delivers a steady stream of qualified patients to your practice.
            </p>
            <div className="mt-8 flex justify-center gap-x-4">
              <Button onClick={() => navigate("/dental-google-ad-generate")} className="bg-gradient-to-r from-grovio-lime to-grovio-teal text-white hover:opacity-90 text-lg px-8 py-6">
                Try Free Generator <ChevronRight className="ml-2" />
              </Button>
            </div>
            <div className="mt-12 flex justify-center">
              <div className="relative max-w-[300px] shadow-2xl rounded-3xl">
                <img 
                  src="/lovable-uploads/853fa172-b866-4e96-b8a6-2c2e61d7e4f3.png" 
                  alt="Google Ads Preview" 
                  className="w-full rounded-3xl"
                />
                <div className="absolute inset-0 rounded-3xl ring-1 ring-black/10"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logo Slider Section */}
      <section className="bg-white border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">
            Trusted by Leading Dental Practices
          </h2>
          <LogoSlider />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="text-center p-6 border-2 hover:border-grovio-teal transition-colors">
              <CardContent>
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-grovio-teal" />
                <h3 className="text-3xl font-bold text-gray-900">300%</h3>
                <p className="mt-2 text-gray-600">Average ROI for dental Google Ads</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-2 hover:border-grovio-teal transition-colors">
              <CardContent>
                <Users className="h-12 w-12 mx-auto mb-4 text-grovio-teal" />
                <h3 className="text-3xl font-bold text-gray-900">82%</h3>
                <p className="mt-2 text-gray-600">of patients search online first</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-2 hover:border-grovio-teal transition-colors">
              <CardContent>
                <Activity className="h-12 w-12 mx-auto mb-4 text-grovio-teal" />
                <h3 className="text-3xl font-bold text-gray-900">24/7</h3>
                <p className="mt-2 text-gray-600">Patient acquisition automation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Common Challenges in Dental Marketing
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[{
            title: "Inconsistent Patient Flow",
            description: "Struggle with unpredictable appointment schedules and revenue"
          }, {
            title: "Complex Ad Management",
            description: "Waste time managing complicated Google Ads campaigns"
          }, {
            title: "High Marketing Costs",
            description: "Overspend on ineffective advertising strategies"
          }, {
            title: "Compliance Concerns",
            description: "Navigate complex healthcare advertising regulations"
          }, {
            title: "Poor ROI Tracking",
            description: "Difficulty measuring marketing campaign effectiveness"
          }, {
            title: "Time Management",
            description: "Balancing patient care with practice marketing"
          }].map((challenge, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
                <p className="text-gray-600">{challenge.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Google Ads Generator?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[{
            icon: Clock,
            title: "Save 10+ Hours Per Week",
            description: "Automated campaign creation and management lets you focus on patient care"
          }, {
            icon: Building,
            title: "Dental-Specific Optimization",
            description: "Pre-built templates and keywords optimized for dental practices"
          }, {
            icon: DollarSign,
            title: "Reduce Ad Spend by 40%",
            description: "AI-powered optimization ensures your budget is spent effectively"
          }, {
            icon: ChartBar,
            title: "Track Real Results",
            description: "Clear reporting on new patient acquisitions and ROI"
          }].map((benefit, index) => <div key={index} className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <benefit.icon className="h-8 w-8 text-grovio-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Trusted by Dental Professionals
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[{
            quote: "We've doubled our new patient appointments within 3 months of using the ad generator.",
            author: "Dr. Sarah Chen",
            practice: "Bright Smile Dental"
          }, {
            quote: "The compliance-ready templates save us hours of work and give us peace of mind.",
            author: "Dr. Michael Rodriguez",
            practice: "Family First Dental Care"
          }, {
            quote: "Finally, a marketing solution that understands the unique needs of dental practices.",
            author: "Dr. Emily Thompson",
            practice: "Advanced Dental Arts"
          }].map((testimonial, index) => <Card key={index} className="p-6">
                <CardContent>
                  <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.practice}</div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-grovio-lime to-grovio-teal py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of dental practices using our AI-powered Google Ads generator to attract more patients and grow their practice.
          </p>
          <div className="flex flex-col gap-4 items-center justify-center">
            <Button onClick={() => navigate("/dental-google-ad-generate")} className="bg-white text-grovio-teal hover:bg-gray-100 text-lg px-8 py-6">
              Start Your Free Trial
            </Button>
            <ul className="flex flex-wrap gap-x-8 gap-y-4 justify-center mt-6">
              {["No credit card required", "14-day free trial", "HIPAA compliant", "Cancel anytime"].map((feature, index) => <li key={index} className="flex items-center text-white">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  {feature}
                </li>)}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
