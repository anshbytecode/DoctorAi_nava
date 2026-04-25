import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  File, 
  Eye, 
  Download,
  Brain,
  X,
  CheckCircle2
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { DocumentAnalyzer } from './DocumentAnalyzer';

interface Document {
  id: string;
  patientId: string;
  patientName: string;
  type: 'image' | 'prescription' | 'lab-report' | 'xray' | 'other';
  fileName: string;
  url: string;
  uploadedAt: string;
  aiAnalysis?: string;
  tags?: string[];
}

export const PatientDocuments = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [uploadType, setUploadType] = useState<'image' | 'prescription' | 'lab-report' | 'xray' | 'other'>('image');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock patients - in production, fetch from API
  const patients = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
  ];

  const handleDocumentUpload = async (result: any) => {
    if (!selectedPatient) {
      toast({
        title: "Please select a patient",
        description: "Select a patient before uploading documents",
        variant: "destructive"
      });
      return;
    }

    const patient = patients.find(p => p.id === selectedPatient);
    const newDocument: Document = {
      id: Date.now().toString(),
      patientId: selectedPatient,
      patientName: patient?.name || 'Unknown',
      type: uploadType,
      fileName: result.fileName || 'document',
      url: result.url || result.ipfsHash || '',
      uploadedAt: new Date().toISOString(),
      tags: []
    };

    setDocuments([...documents, newDocument]);
    toast({
      title: "Document uploaded",
      description: "Document has been uploaded successfully",
    });
  };

  const handleAnalyze = async (documentId: string) => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              aiAnalysis: `AI Analysis: This ${doc.type} shows signs of [condition]. Key findings include [findings]. Recommendations: [recommendations].`,
              tags: ['analyzed', doc.type]
            }
          : doc
      ));
      setIsAnalyzing(false);
      toast({
        title: "Analysis complete",
        description: "AI analysis has been generated for this document",
      });
    }, 2000);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'prescription': return <FileText className="h-5 w-5" />;
      case 'lab-report': return <File className="h-5 w-5" />;
      case 'xray': return <ImageIcon className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-800';
      case 'prescription': return 'bg-green-100 text-green-800';
      case 'lab-report': return 'bg-purple-100 text-purple-800';
      case 'xray': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Patient Documents</CardTitle>
          <CardDescription>
            Upload and analyze patient photos, prescriptions, lab reports, and X-rays
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Patient</Label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select a patient...</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Document Type</Label>
            <Tabs value={uploadType} onValueChange={(v) => setUploadType(v as any)}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="prescription">Prescription</TabsTrigger>
                <TabsTrigger value="lab-report">Lab Report</TabsTrigger>
                <TabsTrigger value="xray">X-Ray</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label>Upload Document</Label>
            <ImageUpload
              onUploadComplete={handleDocumentUpload}
              label={`Upload ${uploadType}`}
              maxSize={10}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patient Documents</CardTitle>
          <CardDescription>View and analyze uploaded documents</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No documents uploaded yet</p>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(doc.type)}
                      <div>
                        <h3 className="font-semibold">{doc.fileName}</h3>
                        <p className="text-sm text-gray-600">{doc.patientName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getTypeColor(doc.type)}>
                      {doc.type}
                    </Badge>
                  </div>

                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {doc.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {doc.aiAnalysis ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-sm text-blue-900">AI Analysis</span>
                      </div>
                      <p className="text-sm text-blue-800">{doc.aiAnalysis}</p>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAnalyze(doc.id)}
                      disabled={isAnalyzing}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                    </Button>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

