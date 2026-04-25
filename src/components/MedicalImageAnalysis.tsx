import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from './ImageUpload';
import { 
  Scan, 
  X, 
  Image as ImageIcon, 
  AlertTriangle, 
  CheckCircle2,
  Brain,
  Eye,
  FileText
} from 'lucide-react';

interface ImageAnalysis {
  imageType: 'xray' | 'scan' | 'skin' | 'wound' | 'other';
  findings: string[];
  flags: {
    type: 'critical' | 'warning' | 'info';
    message: string;
    recommendation: string;
  }[];
  suggestedAction: 'urgent-review' | 'routine-review' | 'follow-up' | 'normal';
  specialistRecommendation?: string;
  confidence: number;
}

export const MedicalImageAnalysis = () => {
  const { toast } = useToast();
  const [selectedImageType, setSelectedImageType] = useState<'xray' | 'scan' | 'skin' | 'wound' | 'other'>('xray');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);

  const handleImageUpload = async (result: any) => {
    setUploadedImage(result.url || result.ipfsHash || '');
    toast({
      title: "Image uploaded",
      description: "Ready for AI analysis",
    });
  };

  const analyzeImage = async () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI image analysis
    setTimeout(() => {
      let mockAnalysis: ImageAnalysis;

      switch (selectedImageType) {
        case 'xray':
          mockAnalysis = {
            imageType: 'xray',
            findings: [
              'Lung fields appear clear bilaterally',
              'No obvious consolidation or effusion',
              'Cardiac silhouette within normal limits',
              'Minor opacity noted in right lower lobe - requires review'
            ],
            flags: [
              {
                type: 'warning',
                message: 'Minor opacity detected in right lower lobe',
                recommendation: 'Consider follow-up imaging or clinical correlation'
              }
            ],
            suggestedAction: 'routine-review',
            specialistRecommendation: 'Radiologist review recommended for complete interpretation',
            confidence: 78
          };
          break;

        case 'scan':
          mockAnalysis = {
            imageType: 'scan',
            findings: [
              'No acute intracranial abnormalities',
              'Brain parenchyma appears normal',
              'Ventricular system within normal limits',
              'No mass effect or midline shift'
            ],
            flags: [
              {
                type: 'info',
                message: 'Scan appears normal',
                recommendation: 'Clinical correlation recommended'
              }
            ],
            suggestedAction: 'normal',
            specialistRecommendation: 'Radiologist review for formal interpretation',
            confidence: 85
          };
          break;

        case 'skin':
          mockAnalysis = {
            imageType: 'skin',
            findings: [
              'Irregular border noted',
              'Color variation present',
              'Asymmetric lesion',
              'Diameter appears >6mm'
            ],
            flags: [
              {
                type: 'critical',
                message: 'ABCDE criteria suggest possible dermatological concern',
                recommendation: 'Urgent dermatologist evaluation recommended'
              }
            ],
            suggestedAction: 'urgent-review',
            specialistRecommendation: 'Dermatologist consultation strongly recommended',
            confidence: 72
          };
          break;

        case 'wound':
          mockAnalysis = {
            imageType: 'wound',
            findings: [
              'Wound edges appear clean',
              'No obvious signs of infection',
              'Granulation tissue present',
              'Mild erythema around wound margins'
            ],
            flags: [
              {
                type: 'warning',
                message: 'Mild erythema noted',
                recommendation: 'Monitor for signs of infection, consider topical treatment'
              }
            ],
            suggestedAction: 'follow-up',
            specialistRecommendation: 'Wound care specialist review if healing delayed',
            confidence: 80
          };
          break;

        default:
          mockAnalysis = {
            imageType: 'other',
            findings: ['Image processed', 'Basic analysis complete'],
            flags: [],
            suggestedAction: 'routine-review',
            confidence: 60
          };
      }

      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      toast({
        title: "Analysis complete",
        description: "AI image analysis generated",
      });
    }, 3000);
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'urgent-review': return 'bg-red-100 text-red-800 border-red-300';
      case 'routine-review': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'follow-up': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getFlagIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default: return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-6 w-6 text-blue-600" />
            Medical Image Understanding
          </CardTitle>
          <CardDescription>
            AI-powered analysis of X-rays, scans, skin photos, and wound images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={selectedImageType} onValueChange={(v) => setSelectedImageType(v as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="xray">X-Ray</TabsTrigger>
              <TabsTrigger value="scan">Scan</TabsTrigger>
              <TabsTrigger value="skin">Skin</TabsTrigger>
              <TabsTrigger value="wound">Wound</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Upload Medical Image</label>
              <ImageUpload
                onUploadComplete={handleImageUpload}
                label={`Upload ${selectedImageType} image`}
                maxSize={10}
              />
            </div>

            {uploadedImage && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Image uploaded successfully</span>
                </div>
                <Button 
                  onClick={analyzeImage} 
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-4">
          <Alert className={`border-2 ${getActionColor(analysis.suggestedAction)}`}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="font-bold">
              Suggested Action: {analysis.suggestedAction.replace('-', ' ').toUpperCase()}
            </AlertTitle>
            <AlertDescription>
              AI Confidence: {analysis.confidence}%
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Findings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Key Findings:</h4>
                <ul className="space-y-2">
                  {analysis.findings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {analysis.flags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Flags & Recommendations:</h4>
                  <div className="space-y-2">
                    {analysis.flags.map((flag, idx) => (
                      <Alert key={idx} className={`border-l-4 ${
                        flag.type === 'critical' ? 'border-red-500 bg-red-50' :
                        flag.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}>
                        {getFlagIcon(flag.type)}
                        <AlertTitle>{flag.message}</AlertTitle>
                        <AlertDescription>{flag.recommendation}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {analysis.specialistRecommendation && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-1">Specialist Recommendation</h4>
                      <p className="text-sm text-purple-800">{analysis.specialistRecommendation}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600">
                <FileText className="h-4 w-4 inline mr-1" />
                <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical interpretation by qualified specialists.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

