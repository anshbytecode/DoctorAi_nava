import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Pill, 
  AlertTriangle, 
  CheckCircle2,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  category: string;
  supplier?: string;
  price?: number;
}

export const MedicineInventory = () => {
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      quantity: 250,
      unit: 'tablets',
      expiryDate: '2026-06-30',
      category: 'Analgesic & Antipyretic',
      supplier: 'Cipla Healthcare',
      price: 0.5
    },
    {
      id: '2',
      name: 'Amoxicillin + Clavulanate 625mg',
      genericName: 'Amoxicillin Clavulanate',
      quantity: 120,
      unit: 'tablets',
      expiryDate: '2025-11-15',
      category: 'Broad-Spectrum Antibiotic',
      supplier: 'Sun Pharma',
      price: 1.8
    },
    {
      id: '3',
      name: 'Metformin Hydrochloride 500mg',
      genericName: 'Metformin',
      quantity: 340,
      unit: 'tablets',
      expiryDate: '2026-08-20',
      category: 'Antidiabetic',
      supplier: 'Torrent Pharma',
      price: 0.6
    },
    {
      id: '4',
      name: 'Telmisartan 40mg',
      genericName: 'Telmisartan',
      quantity: 180,
      unit: 'tablets',
      expiryDate: '2026-04-10',
      category: 'Antihypertensive',
      supplier: 'Lupin Labs',
      price: 1.1
    },
    {
      id: '5',
      name: 'Atorvastatin 10mg',
      genericName: 'Atorvastatin',
      quantity: 190,
      unit: 'tablets',
      expiryDate: '2025-10-05',
      category: 'Lipid-Lowering Statin',
      supplier: 'Dr. Reddy Labs',
      price: 1.4
    },
    {
      id: '6',
      name: 'Montelukast + Levocetirizine',
      genericName: 'Montelukast Levocetirizine',
      quantity: 95,
      unit: 'tablets',
      expiryDate: '2025-09-30',
      category: 'Antiallergic & Respiratory',
      supplier: 'Glenmark Pharma',
      price: 1.6
    },
    {
      id: '7',
      name: 'Salbutamol Inhaler 100mcg',
      genericName: 'Albuterol',
      quantity: 45,
      unit: 'inhalers',
      expiryDate: '2026-01-15',
      category: 'Bronchodilator',
      supplier: 'Cipla Respiratory',
      price: 4.5
    },
    {
      id: '8',
      name: 'Pantoprazole 40mg (Gastro-resistant)',
      genericName: 'Pantoprazole',
      quantity: 210,
      unit: 'capsules',
      expiryDate: '2026-05-18',
      category: 'Proton Pump Inhibitor (Antacid)',
      supplier: 'Alkem Laboratories',
      price: 0.9
    },
    {
      id: '9',
      name: 'Azithromycin 500mg',
      genericName: 'Azithromycin',
      quantity: 65,
      unit: 'tablets',
      expiryDate: '2025-08-25',
      category: 'Macrolide Antibiotic',
      supplier: 'Zydus Cadila',
      price: 2.2
    },
    {
      id: '10',
      name: 'Cholecalciferol Vitamin D3 60K',
      genericName: 'Vitamin D3',
      quantity: 160,
      unit: 'capsules',
      expiryDate: '2026-12-31',
      category: 'Vitamin Supplement',
      supplier: 'Abbott Healthcare',
      price: 1.5
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: '',
    genericName: '',
    quantity: 0,
    unit: 'tablets',
    expiryDate: '',
    category: '',
    supplier: '',
    price: 0
  });

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.genericName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'bg-red-100 text-red-800', label: 'Expired' };
    if (daysUntilExpiry <= 30) return { status: 'expiring', color: 'bg-orange-100 text-orange-800', label: 'Expiring Soon' };
    if (daysUntilExpiry <= 90) return { status: 'warning', color: 'bg-yellow-100 text-yellow-800', label: 'Expires in 90 days' };
    return { status: 'ok', color: 'bg-green-100 text-green-800', label: 'Valid' };
  };

  const lowStockMedicines = medicines.filter(med => med.quantity < 50);
  const expiringMedicines = medicines.filter(med => {
    const expiry = new Date(med.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  });

  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setFormData({
      name: '',
      genericName: '',
      quantity: 0,
      unit: 'tablets',
      expiryDate: '',
      category: '',
      supplier: '',
      price: 0
    });
    setIsDialogOpen(true);
  };

  const handleEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData(medicine);
    setIsDialogOpen(true);
  };

  const handleSaveMedicine = () => {
    if (!formData.name || !formData.expiryDate || formData.quantity === undefined) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (editingMedicine) {
      setMedicines(prev => prev.map(med => 
        med.id === editingMedicine.id ? { ...formData, id: editingMedicine.id } as Medicine : med
      ));
      toast({
        title: "Medicine updated",
        description: `${formData.name} has been updated`,
      });
    } else {
      const newMedicine: Medicine = {
        ...formData,
        id: Date.now().toString()
      } as Medicine;
      setMedicines([...medicines, newMedicine]);
      toast({
        title: "Medicine added",
        description: `${formData.name} has been added to inventory`,
      });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteMedicine = (id: string) => {
    const medicine = medicines.find(m => m.id === id);
    if (confirm(`Are you sure you want to delete ${medicine?.name}?`)) {
      setMedicines(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Medicine deleted",
        description: `${medicine?.name} has been removed from inventory`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {(lowStockMedicines.length > 0 || expiringMedicines.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockMedicines.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-800">
                  {lowStockMedicines.length} medicine(s) are running low on stock
                </p>
              </CardContent>
            </Card>
          )}
          {expiringMedicines.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Expiry Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-800">
                  {expiringMedicines.length} medicine(s) are expiring within 30 days
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Medicine Inventory</CardTitle>
              <CardDescription>Manage your clinic's medicine stock</CardDescription>
            </div>
            <Button onClick={handleAddMedicine}>
              <Plus className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Generic Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No medicines found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMedicines.map((medicine) => {
                      const expiryStatus = getExpiryStatus(medicine.expiryDate);
                      return (
                        <TableRow key={medicine.id}>
                          <TableCell className="font-medium">{medicine.name}</TableCell>
                          <TableCell>{medicine.genericName || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={medicine.quantity < 50 ? 'destructive' : 'secondary'}>
                              {medicine.quantity} {medicine.unit}
                            </Badge>
                          </TableCell>
                          <TableCell>{medicine.category}</TableCell>
                          <TableCell>{new Date(medicine.expiryDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={expiryStatus.color}>
                              {expiryStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditMedicine(medicine)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteMedicine(medicine.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
            </DialogTitle>
            <DialogDescription>
              {editingMedicine ? 'Update medicine information' : 'Add a new medicine to your inventory'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Medicine Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Paracetamol 500mg"
                />
              </div>
              <div className="space-y-2">
                <Label>Generic Name</Label>
                <Input
                  value={formData.genericName}
                  onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                  placeholder="e.g., Acetaminophen"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="tablets">Tablets</option>
                  <option value="capsules">Capsules</option>
                  <option value="bottles">Bottles</option>
                  <option value="vials">Vials</option>
                  <option value="units">Units</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Analgesic"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expiry Date *</Label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Input
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Supplier name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Price per unit</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMedicine}>
                {editingMedicine ? 'Update' : 'Add'} Medicine
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

