import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Coins, Gift, CheckCircle2, Activity } from 'lucide-react';

const TASKS = [
  { id: 'meds', label: 'Daily medication adherence check-in', reward: 5, completed: true },
  { id: 'log', label: 'Log vitals today', reward: 3, completed: false },
  { id: 'exercise', label: 'Complete 30 min activity', reward: 4, completed: false },
  { id: 'consult', label: 'Attend tele-consult this week', reward: 8, completed: true },
];

const REWARDS = [
  { id: 'consult', label: 'Free tele-consult credit', cost: 40 },
  { id: 'device', label: '10% off wearable device', cost: 60 },
  { id: 'token', label: 'Mint wellness NFT badge', cost: 25 },
];

export const TokenRewards = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState(52);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const handleRedeem = () => {
    if (!selectedReward) {
      toast({ title: 'Select a reward', description: 'Choose a reward to redeem tokens.' });
      return;
    }
    const reward = REWARDS.find((r) => r.id === selectedReward)!;
    if (balance < reward.cost) {
      toast({ title: 'Insufficient tokens', description: 'Complete more tasks to earn tokens.', variant: 'destructive' });
      return;
    }
    setBalance(balance - reward.cost);
    toast({ title: 'Reward redeemed', description: `${reward.label} unlocked!` });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          Adherence Rewards
        </CardTitle>
        <CardDescription>
          Earn on-chain or in-app tokens for med adherence, check-ins, and exercise. Redeem for tele-consults or perks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="text-sm text-gray-600">Current balance</p>
          <p className="text-3xl font-bold">{balance} TOK</p>
          <Progress value={(balance / 100) * 100} className="mt-2 h-2" />
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Today's Earning Opportunities</h4>
          {TASKS.map((task) => (
            <Card key={task.id} className="bg-white">
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium">{task.label}</p>
                  <p className="text-xs text-gray-500">+{task.reward} TOK</p>
                </div>
                {task.completed ? (
                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Done
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast({ title: 'Task recorded', description: 'Tokens added to your balance.' })}
                  >
                    Mark Complete
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Redeem Tokens</h4>
          <div className="grid gap-3 sm:grid-cols-3">
            {REWARDS.map((reward) => (
              <button
                key={reward.id}
                className={`rounded-lg border p-3 text-left ${
                  selectedReward === reward.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedReward(reward.id)}
              >
                <p className="font-medium">{reward.label}</p>
                <p className="text-sm text-gray-500">{reward.cost} TOK</p>
              </button>
            ))}
          </div>
          <Button onClick={handleRedeem} className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Redeem Reward
          </Button>
        </div>

        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertDescription className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-yellow-600" />
            Keep streaks for bonus tokens and unlock Web3 NFT badges automatically.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

