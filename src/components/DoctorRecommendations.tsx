
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Star, Phone, Calendar, Award, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppointmentBooking } from './AppointmentBooking';

interface DoctorRecommendationsProps {
  analysisResult?: any;
}

export const DoctorRecommendations = ({ analysisResult }: DoctorRecommendationsProps) => {
  const [searchLocation, setSearchLocation] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const specialties = [
    { value: 'all', label: 'All Specialties' },
    { value: 'family', label: 'Family Medicine' },
    { value: 'internal', label: 'Internal Medicine' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedic', label: 'Orthopedic Surgery' },
    { value: 'psychiatry', label: 'Psychiatry' },
  ];

  const mockDoctors = [
    {
      id: 1,
      name: 'Dr. Anand Shinde',
      specialty: 'Family Medicine',
      rating: 4.9,
      reviewCount: 342,
      location: 'Kalyani Nagar Medical Plaza',
      distance: '0.8 km',
      nextAvailable: '2025-01-15',
      phone: '+91 9912345678',
      experience: '15 years',
      education: 'MBBS, MD (Family Medicine)',
      acceptingNewPatients: true,
      matchScore: 96
    },
    {
      id: 2,
      name: 'Dr. Priya Deshmukh',
      specialty: 'Cardiology',
      rating: 4.95,
      reviewCount: 420,
      location: 'Apollo Heart & Vascular Institute',
      distance: '1.5 km',
      nextAvailable: '2025-01-16',
      phone: '+91 9822014589',
      experience: '18 years',
      education: 'MBBS, DM (Cardiology), FACC',
      acceptingNewPatients: true,
      matchScore: 98
    },
    {
      id: 3,
      name: 'Dr. Narendra Godi',
      specialty: 'Neurology',
      rating: 4.8,
      reviewCount: 215,
      location: 'City Neuro Care Centre',
      distance: '2.1 km',
      nextAvailable: '2025-01-18',
      phone: '+91 9125434567',
      experience: '14 years',
      education: 'MBBS, MD, DM (Neurology)',
      acceptingNewPatients: true,
      matchScore: 92
    },
    {
      id: 4,
      name: 'Dr. Aisha Khan',
      specialty: 'Dermatology',
      rating: 4.85,
      reviewCount: 310,
      location: 'DermaGlow Skin & Laser Clinic',
      distance: '1.1 km',
      nextAvailable: '2025-01-17',
      phone: '+91 9730456123',
      experience: '9 years',
      education: 'MBBS, MD (Dermatology & Venereology)',
      acceptingNewPatients: true,
      matchScore: 91
    },
    {
      id: 5,
      name: 'Dr. Vikramaditya Rao',
      specialty: 'Orthopedic Surgery',
      rating: 4.9,
      reviewCount: 378,
      location: 'Ruby Hall Bone & Joint Hospital',
      distance: '2.8 km',
      nextAvailable: '2025-01-19',
      phone: '+91 9423804112',
      experience: '20 years',
      education: 'MBBS, MS (Orthopedics), MCh',
      acceptingNewPatients: true,
      matchScore: 94
    },
    {
      id: 6,
      name: 'Dr. Dhruv Bhilare',
      specialty: 'Internal Medicine',
      rating: 4.8,
      reviewCount: 289,
      location: 'MIT Wellness Medical Centre',
      distance: '1.2 km',
      nextAvailable: '2025-01-15',
      phone: '+91 9423804112',
      experience: '12 years',
      education: 'MBBS, DNB (Internal Medicine)',
      acceptingNewPatients: true,
      matchScore: 89
    },
    {
      id: 7,
      name: 'Dr. Sneha Kulkarni',
      specialty: 'Psychiatry',
      rating: 4.92,
      reviewCount: 198,
      location: 'MindCare Behavioral & Mental Wellness',
      distance: '3.0 km',
      nextAvailable: '2025-01-20',
      phone: '+91 9881234567',
      experience: '11 years',
      education: 'MBBS, MD (Psychiatry)',
      acceptingNewPatients: true,
      matchScore: 95
    },
    {
      id: 8,
      name: 'Dr. Rajesh Mehta',
      specialty: 'Pediatrics',
      rating: 4.9,
      reviewCount: 512,
      location: 'Rainbow Children & Newborn Clinic',
      distance: '1.7 km',
      nextAvailable: '2025-01-16',
      phone: '+91 9923456781',
      experience: '16 years',
      education: 'MBBS, DCH, MD (Pediatrics)',
      acceptingNewPatients: true,
      matchScore: 97
    }
  ];

  const searchDoctors = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredDoctors = mockDoctors;
      
      if (specialty !== 'all') {
        filteredDoctors = filteredDoctors.filter(doc => 
          doc.specialty.toLowerCase().includes(specialty)
        );
      }
      
      // Sort by match score if we have analysis results
      if (analysisResult) {
        filteredDoctors = filteredDoctors.sort((a, b) => b.matchScore - a.matchScore);
      }
      
      setDoctors(filteredDoctors);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    searchDoctors();
  }, [specialty, analysisResult]);


  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Award className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Find the Right Doctor</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {analysisResult 
            ? "Based on your symptom analysis, we've ranked doctors by relevance to your condition"
            : "Search for healthcare providers in your area by specialty and location"
          }
        </p>
      </div>

      {analysisResult && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">AI-Powered Recommendations</h3>
                <p className="text-blue-800 text-sm">
                  Doctors are ranked based on their expertise with conditions similar to your symptoms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
          <CardDescription>Find doctors that match your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Input
                placeholder="Enter city or zip code"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((spec) => (
                    <SelectItem key={spec.value} value={spec.value}>
                      {spec.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={searchDoctors} disabled={loading} className="w-full">
                {loading ? 'Searching...' : 'Search Doctors'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                        {analysisResult && (
                          <Badge className="bg-green-100 text-green-800">
                            {doctor.matchScore}% Match
                          </Badge>
                        )}
                      </div>
                      <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{doctor.rating}</span>
                      <span className="text-gray-500 text-sm">({doctor.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{doctor.location} • {doctor.distance}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{doctor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>{doctor.education}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge 
                      variant={doctor.acceptingNewPatients ? "default" : "secondary"}
                      className={doctor.acceptingNewPatients ? "bg-green-100 text-green-800" : ""}
                    >
                      {doctor.acceptingNewPatients ? "Accepting New Patients" : "Not Accepting New Patients"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Next available: {doctor.nextAvailable}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 lg:ml-6">
                  <AppointmentBooking 
                    doctor={{
                      id: doctor.id,
                      name: doctor.name,
                      specialty: doctor.specialty,
                      phone: doctor.phone
                    }}
                    trigger={
                      <Button 
                        disabled={!doctor.acceptingNewPatients}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Button>
                    }
                  />
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
