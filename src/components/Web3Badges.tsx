import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Star, Shield, Zap } from 'lucide-react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useAuth } from '@/contexts/AuthContext';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  unlocked: boolean;
  requirement: string;
}

export const Web3Badges = () => {
  const { isConnected, account } = useWeb3();
  const { user } = useAuth();

  const badges: BadgeData[] = [
    {
      id: 'wallet-connect',
      name: 'Web3 Pioneer',
      description: 'Connected your Web3 wallet',
      icon: Zap,
      color: 'bg-purple-100 text-purple-800',
      unlocked: isConnected,
      requirement: 'Connect a Web3 wallet',
    },
    {
      id: 'first-record',
      name: 'Health Tracker',
      description: 'Recorded your first health metric',
      icon: Star,
      color: 'bg-blue-100 text-blue-800',
      unlocked: true, // Demo - in real app, check if user has records
      requirement: 'Record your first health metric',
    },
    {
      id: 'appointment-booker',
      name: 'Appointment Master',
      description: 'Booked your first appointment',
      icon: Trophy,
      color: 'bg-yellow-100 text-yellow-800',
      unlocked: false, // Demo
      requirement: 'Book an appointment',
    },
    {
      id: 'medication-tracker',
      name: 'Medication Manager',
      description: 'Added your first medication',
      icon: Shield,
      color: 'bg-green-100 text-green-800',
      unlocked: true, // Demo
      requirement: 'Add a medication to track',
    },
    {
      id: 'health-enthusiast',
      name: 'Health Enthusiast',
      description: 'Recorded 10 health entries',
      icon: Award,
      color: 'bg-red-100 text-red-800',
      unlocked: false, // Demo
      requirement: 'Record 10 health entries',
    },
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Web3 Achievements</span>
          </span>
          <Badge variant="outline">
            {unlockedCount}/{totalCount}
          </Badge>
        </CardTitle>
        <CardDescription>
          Unlock achievements and showcase your health journey on Web3
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-4 border rounded-lg ${
                  badge.unlocked
                    ? 'bg-white border-green-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      badge.unlocked ? badge.color : 'bg-gray-200'
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        badge.unlocked ? 'text-current' : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{badge.name}</h4>
                      {badge.unlocked && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {badge.description}
                    </p>
                    {!badge.unlocked && (
                      <p className="text-xs text-gray-500 mt-2">
                        Requirement: {badge.requirement}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isConnected && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <p className="text-sm font-medium text-purple-900 mb-1">
              🎉 Web3 Features Enabled
            </p>
            <p className="text-xs text-purple-700">
              Your achievements and health data can be stored on the blockchain for permanent,
              decentralized access. Your wallet is securely connected.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

