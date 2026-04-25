
import { Activity, Users, BookOpen, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}


export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'symptoms', label: 'Symptom Checker', icon: Activity },
    { id: 'doctors', label: 'Find Doctors', icon: Users },
    { id: 'education', label: 'Health Education', icon: BookOpen },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 items-center justify-between">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`flex items-center space-x-2 px-6 py-4 rounded-none border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-transparent hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </Button>
              );
            })}
          </div>
          {isAuthenticated && (
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="font-medium">Dashboard</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
