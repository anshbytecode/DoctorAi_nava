import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  File, 
  Eye, 
  Download,
  Brain,
  X
} from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { DocumentAnalyzer } from './DocumentAnalyzer';

interface Document {
  id: string;
  type: 'image' | 'prescription' | 'lab-report' | 'xray' | 'other';
  fileName: string;
  url: string;
  uploadedAt: string;
  aiAnalysis?: string;
  tags?: string[];
}

export const PatientDocumentUpload = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadType, setUploadType] = useState<'image' | 'prescription' | 'lab-report' | 'xray' | 'other'>('image');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleDocumentUpload = async (result: any) => {
    const newDocument: Document = {
      id: Date.now().toString(),
      type: uploadType,
      fileName: result.fileName || `document-${Date.now()}`,
      url: result.url || (result.hash ? `https://gateway.pinata.cloud/ipfs/${result.hash}` : ''),
      uploadedAt: new Date().toISOString(),
      tags: []
    };

    setDocuments([...documents, newDocument]);
    toast({
      title: "Document uploaded",
      description: "Your document has been uploaded successfully",
    });
  };

  const handleAnalyze = async (documentId: string) => {
    setIsAnalyzing(true);
    const document = documents.find(d => d.id === documentId);
    if (document) {
      setSelectedDocument(document);
    }
    
    // Simulate AI analysis
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              aiAnalysis: `AI Analysis: This ${doc.type} has been analyzed. Key findings: [findings]. Recommendations: [recommendations]. Please consult with your doctor for professional interpretation.`,
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

  const handleDelete = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast({
        title: "Document deleted",
        description: "Document has been removed",
      });
    }
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
          <CardTitle>Upload Your Documents</CardTitle>
          <CardDescription>
            Upload photos, prescriptions, lab reports, and X-rays for AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Type</label>
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
            <label className="text-sm font-medium">Upload Document</label>
            <ImageUpload
              onUploadComplete={handleDocumentUpload}
              label={`Upload ${uploadType}`}
              maxSize={10}
              accept="image/*,application/pdf,text/plain"
              chooseLabel="Choose document"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <strong>Note:</strong> Upload documents to get AI-powered insights. For medical diagnosis, always consult with a healthcare professional.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>View and analyze your uploaded documents</CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No documents uploaded yet. Start by uploading your first document above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(doc.type)}
                      <div>
                        <h3 className="font-semibold">{doc.fileName}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(doc.uploadedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(doc.type)}>
                        {doc.type}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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
                      className="w-full"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                    </Button>
                  )}

                  {selectedDocument && selectedDocument.id === doc.id && doc.aiAnalysis && (
                    <DocumentAnalyzer
                      documentUrl={doc.url}
                      documentType={doc.type}
                      onAnalysisComplete={(analysis) => {
                        setDocuments(prev => prev.map(d => 
                          d.id === doc.id ? { ...d, aiAnalysis: analysis } : d
                        ));
                      }}
                    />
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        if (!doc.url) return;
                        window.open(doc.url, '_blank', 'noopener,noreferrer');
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        if (!doc.url) return;
                        const a = document.createElement('a');
                        a.href = doc.url;
                        a.download = doc.fileName || 'document';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                      }}
                    >
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

