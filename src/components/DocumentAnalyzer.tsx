import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Brain, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface DocumentAnalyzerProps {
  documentUrl: string;
  documentType: 'image' | 'prescription' | 'lab-report' | 'xray' | 'other';
  onAnalysisComplete?: (analysis: string) => void;
}

export const DocumentAnalyzer = ({ 
  documentUrl, 
  documentType,
  onAnalysisComplete 
}: DocumentAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [findings, setFindings] = useState<string[]>([]);
  const { toast } = useToast();

  const analyzeDocument = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis - in production, call actual AI service
    setTimeout(() => {
      let mockAnalysis = '';
      let mockFindings: string[] = [];

      switch (documentType) {
        case 'image':
          mockAnalysis = 'Image Analysis: The uploaded image shows visible symptoms consistent with [condition]. Key observations include redness, swelling, and texture changes. Recommendation: Further clinical examination recommended.';
          mockFindings = ['Redness detected', 'Swelling present', 'Texture changes observed'];
          break;
        case 'prescription':
          mockAnalysis = 'Prescription Analysis: This prescription contains [medications]. Dosage appears appropriate. Potential interactions: [none detected]. Patient should follow instructions carefully.';
          mockFindings = ['Medications identified', 'Dosage verified', 'No interactions detected'];
          break;
        case 'lab-report':
          mockAnalysis = 'Lab Report Analysis: Key values analyzed. Some parameters are outside normal range: [list]. Overall assessment: [condition]. Follow-up recommended.';
          mockFindings = ['Values outside normal range', 'Trend analysis complete', 'Recommendations generated'];
          break;
        case 'xray':
          mockAnalysis = 'X-Ray Analysis: Image quality is good. Findings include [findings]. No acute abnormalities detected. Comparison with previous studies recommended.';
          mockFindings = ['Image quality: Good', 'No acute abnormalities', 'Comparison recommended'];
          break;
        default:
          mockAnalysis = 'Document Analysis: Document has been processed. Key information extracted. Please review for clinical relevance.';
          mockFindings = ['Document processed', 'Information extracted'];
      }

      setAnalysis(mockAnalysis);
      setFindings(mockFindings);
      setIsAnalyzing(false);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(mockAnalysis);
      }

      toast({
        title: "Analysis complete",
        description: "AI analysis has been generated",
      });
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          AI Document Analysis
        </CardTitle>
        <CardDescription>
          Get AI-powered insights from medical documents and images
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis && !isAnalyzing && (
          <Button 
            onClick={analyzeDocument}
            className="w-full"
            size="lg"
          >
            <Brain className="mr-2 h-4 w-4" />
            Analyze Document
          </Button>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Analyzing document with AI...</p>
            <p className="text-xs text-gray-500">This may take a few moments</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-sm">Analysis Complete</span>
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{analysis}</p>
            </div>

            {findings.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Key Findings:</h4>
                <div className="flex flex-wrap gap-2">
                  {findings.map((finding, idx) => (
                    <Badge key={idx} variant="outline" className="bg-green-50 text-green-800 border-green-300">
                      {finding}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setAnalysis(null);
                  setFindings([]);
                }}
              >
                Re-analyze
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(analysis);
                  toast({
                    title: "Copied to clipboard",
                    description: "Analysis text has been copied",
                  });
                }}
              >
                Copy Analysis
              </Button>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <AlertTriangle className="h-4 w-4 inline mr-1" />
          <strong>Note:</strong> AI analysis is for informational purposes only and should not replace professional medical judgment.
        </div>
      </CardContent>
    </Card>
  );
};

