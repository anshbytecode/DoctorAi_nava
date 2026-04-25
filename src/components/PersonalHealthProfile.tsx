import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Heart, 
  Activity, 
  AlertTriangle,
  Save,
  Edit
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HealthProfile {
  age: number;
  gender: string;
  weight: number;
  height: number;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  familyHistory: string[];
  lifestyle: {
    exercise: string;
    smoking: string;
    alcohol: string;
    diet: string;
  };
}

export const PersonalHealthProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<HealthProfile>({
    age: 30,
    gender: 'male',
    weight: 70,
    height: 170,
    bloodType: 'O+',
    allergies: ['None'],
    chronicConditions: [],
    medications: [],
    familyHistory: [],
    lifestyle: {
      exercise: 'weekly',
      smoking: 'no',
      alcohol: 'occasional',
      diet: 'balanced'
    }
  });

  const handleSave = () => {
    toast({
      title: "Profile saved",
      description: "Your health profile has been updated",
    });
    setIsEditing(false);
  };

  const calculateBMI = () => {
    if (profile.height && profile.weight) {
      const heightInMeters = profile.height / 100;
      return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return 'N/A';
  };

  const getBMICategory = (bmi: string) => {
    const bmiNum = parseFloat(bmi);
    if (isNaN(bmiNum)) return { category: 'N/A', color: 'bg-gray-100 text-gray-800' };
    if (bmiNum < 18.5) return { category: 'Underweight', color: 'bg-blue-100 text-blue-800' };
    if (bmiNum < 25) return { category: 'Normal', color: 'bg-green-100 text-green-800' };
    if (bmiNum < 30) return { category: 'Overweight', color: 'bg-yellow-100 text-yellow-800' };
    return { category: 'Obese', color: 'bg-red-100 text-red-800' };
  };

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Health Profile</h2>
          <p className="text-gray-600">Your health information helps AI provide better recommendations</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Age</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{profile.age} years</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                {isEditing ? (
                  <Select value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-600 capitalize">{profile.gender}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{profile.weight} kg</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || 0 })}
                  />
                ) : (
                  <p className="text-sm text-gray-600">{profile.height} cm</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Blood Type</Label>
              {isEditing ? (
                <Select value={profile.bloodType} onValueChange={(value) => setProfile({ ...profile, bloodType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-gray-600">{profile.bloodType}</p>
              )}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">BMI</p>
                  <p className="text-2xl font-bold">{bmi}</p>
                </div>
                <Badge className={bmiInfo.color}>
                  {bmiInfo.category}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Health Conditions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Allergies</Label>
              {isEditing ? (
                <Input
                  placeholder="e.g., Peanuts, Dust, Pollen"
                  value={profile.allergies.join(', ')}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a) 
                  })}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.allergies.map((allergy, idx) => (
                    <Badge key={idx} variant="outline">{allergy}</Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Chronic Conditions</Label>
              {isEditing ? (
                <Input
                  placeholder="e.g., Diabetes, Hypertension"
                  value={profile.chronicConditions.join(', ')}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    chronicConditions: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                  })}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.chronicConditions.length > 0 ? (
                    profile.chronicConditions.map((condition, idx) => (
                      <Badge key={idx} variant="outline" className="bg-orange-50">{condition}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">None</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Family History</Label>
              {isEditing ? (
                <Input
                  placeholder="e.g., Heart disease, Diabetes"
                  value={profile.familyHistory.join(', ')}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    familyHistory: e.target.value.split(',').map(f => f.trim()).filter(f => f) 
                  })}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.familyHistory.length > 0 ? (
                    profile.familyHistory.map((history, idx) => (
                      <Badge key={idx} variant="outline" className="bg-purple-50">{history}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">None recorded</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Lifestyle</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Exercise Frequency</Label>
              {isEditing ? (
                <Select 
                  value={profile.lifestyle.exercise} 
                  onValueChange={(value) => setProfile({ 
                    ...profile, 
                    lifestyle: { ...profile.lifestyle, exercise: value } 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">3-4 times/week</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-gray-600 capitalize">{profile.lifestyle.exercise}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Smoking</Label>
                {isEditing ? (
                  <Select 
                    value={profile.lifestyle.smoking} 
                    onValueChange={(value) => setProfile({ 
                      ...profile, 
                      lifestyle: { ...profile.lifestyle, smoking: value } 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="occasional">Occasional</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-600 capitalize">{profile.lifestyle.smoking}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Alcohol</Label>
                {isEditing ? (
                  <Select 
                    value={profile.lifestyle.alcohol} 
                    onValueChange={(value) => setProfile({ 
                      ...profile, 
                      lifestyle: { ...profile.lifestyle, alcohol: value } 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="occasional">Occasional</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-600 capitalize">{profile.lifestyle.alcohol}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Diet</Label>
              {isEditing ? (
                <Select 
                  value={profile.lifestyle.diet} 
                  onValueChange={(value) => setProfile({ 
                    ...profile, 
                    lifestyle: { ...profile.lifestyle, diet: value } 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-gray-600 capitalize">{profile.lifestyle.diet}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Factors Summary</CardTitle>
            <CardDescription>Based on your health profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {profile.lifestyle.smoking === 'yes' && (
                <Alert className="bg-orange-50 border-orange-200">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Smoking increases risk of heart disease and lung cancer
                  </AlertDescription>
                </Alert>
              )}
              {parseFloat(bmi) > 25 && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Being overweight increases risk of diabetes and heart disease
                  </AlertDescription>
                </Alert>
              )}
              {profile.lifestyle.exercise === 'none' && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Regular exercise can improve your overall health
                  </AlertDescription>
                </Alert>
              )}
              {profile.allergies.length > 0 && profile.allergies[0] !== 'None' && (
                <Alert className="bg-purple-50 border-purple-200">
                  <AlertTriangle className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-purple-800">
                    Make sure healthcare providers are aware of your allergies
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="flex space-x-2">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

