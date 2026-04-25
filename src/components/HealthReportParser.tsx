import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Upload, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from './ImageUpload';
import { useWeb3 } from '@/contexts/Web3Context';

interface LabResult {
  test: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  explanation: string;
}

interface ParsedReport {
  summary: string;
  criticalFindings: string[];
  results: LabResult[];
  recommendations: string[];
  nextSteps: string[];
}

export const HealthReportParser = () => {
  const [reportText, setReportText] = useState('');
  const [parsedReport, setParsedReport] = useState<ParsedReport | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();
  const { isConnected } = useWeb3();

  const parseReport = async () => {
    if (!reportText.trim()) {
      toast({
        title: "Please enter report text",
        variant: "destructive"
      });
      return;
    }

    setIsParsing(true);

    // Simulate AI parsing
    setTimeout(() => {
      const text = reportText.toLowerCase();
      
      const results: LabResult[] = [];
      const criticalFindings: string[] = [];
      const recommendations: string[] = [];
      const nextSteps: string[] = [];

      // Parse common lab values
      if (text.includes('hemoglobin') || text.includes('hb')) {
        const hbMatch = text.match(/(?:hemoglobin|hb)[\s:]*(\d+\.?\d*)/i);
        const hbValue = hbMatch ? parseFloat(hbMatch[1]) : 12;
        const status = hbValue < 10 ? 'critical' : hbValue < 12 ? 'low' : 'normal';
        results.push({
          test: 'Hemoglobin',
          value: hbValue.toString(),
          unit: 'g/dL',
          normalRange: '12-16 g/dL',
          status,
          explanation: hbValue < 10 
            ? 'Your blood count is critically low. This may indicate anemia and requires immediate medical attention.'
            : hbValue < 12
            ? 'Your blood count is slightly low. Consider iron-rich foods and consult your doctor.'
            : 'Your hemoglobin level is within normal range.'
        });
        if (status === 'critical') criticalFindings.push('Low Hemoglobin - Possible Anemia');
      }

      if (text.includes('glucose') || text.includes('blood sugar')) {
        const glucoseMatch = text.match(/(?:glucose|blood sugar|bs)[\s:]*(\d+)/i);
        const glucoseValue = glucoseMatch ? parseFloat(glucoseMatch[1]) : 100;
        const status = glucoseValue > 200 ? 'critical' : glucoseValue > 140 ? 'high' : 'normal';
        results.push({
          test: 'Blood Glucose',
          value: glucoseValue.toString(),
          unit: 'mg/dL',
          normalRange: '70-100 mg/dL (fasting)',
          status,
          explanation: glucoseValue > 200
            ? 'Your blood sugar is very high. This may indicate diabetes. Please consult a doctor immediately.'
            : glucoseValue > 140
            ? 'Your blood sugar is elevated. Monitor your diet and consider consulting a doctor.'
            : 'Your blood glucose level is normal.'
        });
        if (status === 'critical') criticalFindings.push('High Blood Glucose - Possible Diabetes');
      }

      if (text.includes('cholesterol')) {
        const cholMatch = text.match(/cholesterol[\s:]*(\d+)/i);
        const cholValue = cholMatch ? parseFloat(cholMatch[1]) : 200;
        const status = cholValue > 240 ? 'high' : 'normal';
        results.push({
          test: 'Total Cholesterol',
          value: cholValue.toString(),
          unit: 'mg/dL',
          normalRange: '< 200 mg/dL',
          status,
          explanation: cholValue > 240
            ? 'Your cholesterol is high. Reduce intake of oily and fried foods. Exercise regularly.'
            : 'Your cholesterol level is within acceptable range.'
        });
        if (status === 'high') recommendations.push('Reduce saturated fats and increase fiber intake');
      }

      if (text.includes('creatinine')) {
        const creatMatch = text.match(/creatinine[\s:]*(\d+\.?\d*)/i);
        const creatValue = creatMatch ? parseFloat(creatMatch[1]) : 1.0;
        const status = creatValue > 1.5 ? 'high' : 'normal';
        results.push({
          test: 'Creatinine',
          value: creatValue.toString(),
          unit: 'mg/dL',
          normalRange: '0.6-1.2 mg/dL',
          status,
          explanation: creatValue > 1.5
            ? 'Elevated creatinine may indicate kidney function issues. Consult a nephrologist.'
            : 'Your kidney function appears normal.'
        });
      }

      // Generate recommendations
      if (results.some(r => r.status === 'critical')) {
        recommendations.push('Schedule an appointment with your doctor immediately');
        nextSteps.push('Consult with a healthcare provider within 24-48 hours');
      } else if (results.some(r => r.status === 'high' || r.status === 'low')) {
        recommendations.push('Monitor these values and consider lifestyle changes');
        nextSteps.push('Follow up with your doctor for further evaluation');
      } else {
        recommendations.push('Continue maintaining a healthy lifestyle');
        nextSteps.push('Schedule annual health checkup');
      }

      const summary = results.length > 0
        ? `Parsed ${results.length} test results. ${criticalFindings.length > 0 ? 'Critical findings detected.' : 'Most values are within normal range.'}`
        : 'Report parsed. Review the results below.';

      setParsedReport({
        summary,
        criticalFindings,
        results,
        recommendations,
        nextSteps
      });
      setIsParsing(false);
      toast({
        title: "Report parsed successfully",
        description: `Found ${results.length} test results`,
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      case 'low': return <TrendingDown className="h-4 w-4 text-blue-600" />;
      default: return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <FileText className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Health Report Parser</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload or paste your lab reports, prescriptions, or medical documents for AI-powered analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload or Paste Report</CardTitle>
            <CardDescription>
              Paste your lab report text or upload an image/document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Report Text</Label>
              <Textarea
                placeholder="Paste your lab report here...&#10;&#10;Example:&#10;Hemoglobin: 11.5 g/dL&#10;Blood Glucose: 145 mg/dL&#10;Cholesterol: 220 mg/dL&#10;Creatinine: 1.1 mg/dL"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="min-h-48 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Or Upload Report Image/Document</Label>
              <ImageUpload
                accept="image/*,application/pdf,text/plain"
                chooseLabel="Choose report file"
                onFileSelected={(file) => {
                  // Best-effort: auto-fill report text for plain text uploads.
                  // For PDFs/images, users can still paste text manually.
                  if (file.type === 'text/plain') {
                    const reader = new FileReader();
                    reader.onload = (e) => setReportText(String(e.target?.result || ''));
                    reader.readAsText(file);
                  } else if (file.type === 'application/pdf') {
                    setReportText(`Uploaded PDF: ${file.name}\n\nTip: Paste the report text here for parsing.`);
                  } else if (file.type.startsWith('image/')) {
                    setReportText(`Uploaded image: ${file.name}\n\nTip: Paste the report text here for parsing.`);
                  }
                }}
                onUploadComplete={(result) => {
                  toast({
                    title: "Report uploaded",
                    description: result.fileName ? `${result.fileName} uploaded successfully` : "Report uploaded successfully",
                  });
                }}
                label="Upload Report"
                useWeb3={isConnected}
                maxSize={10}
              />
            </div>

            <Button
              onClick={parseReport}
              disabled={isParsing || !reportText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              {isParsing ? (
                <>
                  <FileText className="mr-2 h-4 w-4 animate-spin" />
                  Parsing Report...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Parse Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {parsedReport && (
          <Card>
            <CardHeader>
              <CardTitle>Parsed Results</CardTitle>
              <CardDescription>{parsedReport.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {parsedReport.criticalFindings.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Critical Findings</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2">
                      {parsedReport.criticalFindings.map((finding, idx) => (
                        <li key={idx}>{finding}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h4 className="font-semibold mb-3">Test Results</h4>
                <div className="space-y-3">
                  {parsedReport.results.map((result, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <h5 className="font-medium">{result.test}</h5>
                        </div>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div>
                          <span className="text-gray-500">Value: </span>
                          <span className="font-medium">{result.value} {result.unit}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Normal: </span>
                          <span className="text-gray-600">{result.normalRange}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {result.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {parsedReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <CheckCircle2 className="h-3 w-3 text-green-600 mr-2 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Next Steps</h4>
                <ul className="space-y-1">
                  {parsedReport.nextSteps.map((step, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <TrendingUp className="h-3 w-3 text-blue-600 mr-2 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {!parsedReport && (
          <Card className="bg-gray-50">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Paste your report text and click "Parse Report"</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

