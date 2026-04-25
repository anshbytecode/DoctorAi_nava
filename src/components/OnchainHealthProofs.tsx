import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/contexts/Web3Context';
import { ShieldCheck, Hash, Copy, LinkIcon } from 'lucide-react';

const MOCK_PROOFS = [
  { type: 'Lab Report', date: '2025-01-10', hash: '0xA1B2...C9D0', status: 'verified' },
  { type: 'Tele-consult', date: '2025-01-05', hash: '0xF23C...A8B1', status: 'pending' },
  { type: 'Imaging Report', date: '2024-12-29', hash: '0x7E2D...BBE4', status: 'verified' },
];

export const OnchainHealthProofs = () => {
  const { toast } = useToast();
  const { isConnected, connectWallet, account } = useWeb3();

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast({ title: 'Copied hash', description: `${hash} copied to clipboard.` });
  };

  const handleMintProof = () => {
    toast({ title: 'Proof submitted', description: 'Hash broadcast to blockchain (demo).' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          On-chain Health Proofs
        </CardTitle>
        <CardDescription>
          Hash key health records on-chain so users can prove reports exist without revealing PHI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <Button onClick={connectWallet} className="w-full">
            Connect Wallet
          </Button>
        ) : (
          <Alert className="border-emerald-200 bg-emerald-50">
            <AlertDescription className="flex items-center justify-between">
              <span>Wallet Connected</span>
              <Badge variant="outline">Polygon PoS</Badge>
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg border bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700">New Proof</h3>
          <p className="text-xs text-gray-500">Select a report or visit summary to mint a proof hash.</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <select className="flex-1 rounded-md border px-3 py-2">
              <option>Latest lab report (PDF)</option>
              <option>Tele-consult summary Jan 05</option>
              <option>Chest X-ray DICOM</option>
            </select>
            <Button onClick={handleMintProof} disabled={!isConnected}>
              Mint Health Proof
            </Button>
          </div>
        </div>

        <ScrollArea className="h-64 rounded-lg border">
          <div className="divide-y">
            {MOCK_PROOFS.map((proof, idx) => (
              <div key={idx} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{proof.type}</p>
                  <p className="text-sm text-gray-500">{proof.date}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs font-mono text-gray-600">
                    <Hash className="h-3 w-3" />
                    {proof.hash}
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(proof.hash)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <Badge className={proof.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {proof.status}
                  </Badge>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" />
                    View TX
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

