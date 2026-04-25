import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Ambulance, Star, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Hospital {
  id: number;
  name: string;
  type: 'hospital' | 'clinic' | 'emergency';
  address: string;
  distance: string;
  phone: string;
  emergency: string;
  rating: number;
  specialties: string[];
  open24x7: boolean;
  ambulance: boolean;
}

export const HospitalLocator = () => {
  const [location, setLocation] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const mockHospitals: Hospital[] = [
    {
      id: 1,
      name: 'Apollo Hospitals',
      type: 'hospital',
      address: '123 Medical Street, Pune',
      distance: '2.5 km',
      phone: '+91 20 1234 5678',
      emergency: '108',
      rating: 4.8,
      specialties: ['Cardiology', 'Neurology', 'Emergency'],
      open24x7: true,
      ambulance: true,
    },
    {
      id: 2,
      name: 'City Emergency Clinic',
      type: 'emergency',
      address: '456 Health Avenue, Pune',
      distance: '1.8 km',
      phone: '+91 20 2345 6789',
      emergency: '108',
      rating: 4.5,
      specialties: ['Emergency', 'Trauma'],
      open24x7: true,
      ambulance: true,
    },
    {
      id: 3,
      name: 'Fortis Healthcare',
      type: 'hospital',
      address: '789 Wellness Road, Pune',
      distance: '4.2 km',
      phone: '+91 20 3456 7890',
      emergency: '108',
      rating: 4.7,
      specialties: ['Orthopedics', 'Surgery', 'Emergency'],
      open24x7: true,
      ambulance: true,
    },
    {
      id: 4,
      name: 'Local Health Clinic',
      type: 'clinic',
      address: '321 Community Center, Pune',
      distance: '0.5 km',
      phone: '+91 20 4567 8901',
      emergency: 'N/A',
      rating: 4.2,
      specialties: ['General Medicine', 'Pediatrics'],
      open24x7: false,
      ambulance: false,
    },
  ];

  const searchHospitals = async () => {
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      setHospitals(mockHospitals);
      setIsSearching(false);
      toast({
        title: "Hospitals found",
        description: `Found ${mockHospitals.length} healthcare facilities near you`,
      });
    }, 1000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'hospital': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <MapPin className="h-16 w-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Hospital & Emergency Locator</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find nearby hospitals, clinics, and emergency services in your area
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Hospitals</CardTitle>
          <CardDescription>Enter your location to find nearby healthcare facilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter city, area, or zip code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={searchHospitals} 
              disabled={isSearching}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Emergency?</strong> Call <strong>108</strong> for ambulance services
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {hospitals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Enter your location and search for hospitals</p>
            </CardContent>
          </Card>
        ) : (
          hospitals.map((hospital) => (
            <Card key={hospital.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{hospital.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getTypeColor(hospital.type)}>
                            {hospital.type.toUpperCase()}
                          </Badge>
                          {hospital.open24x7 && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              24/7 Open
                            </Badge>
                          )}
                          {hospital.ambulance && (
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                              <Ambulance className="h-3 w-3 mr-1" />
                              Ambulance
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{hospital.rating}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{hospital.address} • {hospital.distance}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>{hospital.phone}</span>
                      </div>
                      {hospital.emergency !== 'N/A' && (
                        <div className="flex items-center space-x-2 text-red-600">
                          <Ambulance className="h-4 w-4" />
                          <span>Emergency: {hospital.emergency}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{hospital.open24x7 ? 'Open 24/7' : 'Check timings'}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {hospital.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="outline">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 lg:ml-6">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Navigation className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                    <Button variant="outline">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                    {hospital.emergency !== 'N/A' && (
                      <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                        <Ambulance className="mr-2 h-4 w-4" />
                        Emergency
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

