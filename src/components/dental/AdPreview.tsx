
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Smartphone } from "lucide-react";

interface AdPreviewProps {
  title: string;
  description: string;
  url: string;
}

export const AdPreview = ({ title, description, url }: AdPreviewProps) => {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="desktop" onClick={() => setView("desktop")}>
            <Monitor className="w-4 h-4 mr-2" />
            Desktop
          </TabsTrigger>
          <TabsTrigger value="mobile" onClick={() => setView("mobile")}>
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile
          </TabsTrigger>
        </TabsList>
        <TabsContent value="desktop" className="mt-4">
          <div className="border rounded-lg p-4 bg-white">
            <div className="text-sm text-green-700 mb-1">{url}</div>
            <h3 className="text-blue-600 text-xl font-medium mb-1">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </TabsContent>
        <TabsContent value="mobile" className="mt-4">
          <div className="border rounded-lg p-3 bg-white max-w-[320px] mx-auto">
            <div className="text-sm text-green-700 mb-1">{url}</div>
            <h3 className="text-blue-600 text-lg font-medium mb-1">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
