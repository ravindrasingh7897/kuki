import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";

// Define PollutionRecord type locally (matches backend and dashboard)
type PollutionRecord = {
  id: string;
  year: number;
  month: number;
  location: string;
  benzene: number;
  toluene: number;
  no: number;
};
import { useToast } from "@/hooks/use-toast";

interface DataTableProps {
  data: PollutionRecord[];
  loading?: boolean;
  onEdit: (record: PollutionRecord) => void;
  onDelete: (id: string) => void;
  onAdd: (record: Omit<PollutionRecord, 'id'>) => void;
}

export const DataTable = ({ data, loading, onEdit, onDelete, onAdd }: DataTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({
    year: 2021,
    month: 1,
    location: 'Chandigarh',
    benzene: 0,
    toluene: 0,
    no: 0,
    pm25: 0,
    pm10: 0,
    so2: 0,
  });
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<PollutionRecord | null>(null);
  const handleEditClick = (record: PollutionRecord) => {
    setEditRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (editRecord) {
      onEdit(editRecord);
      setIsEditDialogOpen(false);
      toast({ title: "Record updated", description: "Pollution record has been updated successfully." });
    }
  };
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleDelete = (id: string) => {
    onDelete(id);
    toast({
      title: "Record deleted",
      description: "The pollution record has been removed successfully.",
    });
  };

  const handleAddRecord = () => {
    const record = {
      ...newRecord,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAdd(record);
    setIsAddDialogOpen(false);
    setNewRecord({
      year: 2021,
      month: 1,
      location: 'Chandigarh',
      benzene: 0,
      toluene: 0,
      no: 0,
      pm25: 0,
      pm10: 0,
      so2: 0,
    });
    toast({
      title: "Record added",
      description: "New pollution record has been added successfully.",
    });
  };

  const getPollutionLevel = (value: number, pollutant: string) => {
    let threshold = 0;
    switch (pollutant) {
      case 'benzene':
        threshold = 5;
        break;
      case 'toluene':
        threshold = 3;
        break;
      case 'no':
        threshold = 20;
        break;
      default:
        threshold = 100;
    }
    
    if (value > threshold) return 'high';
    if (value > threshold * 0.7) return 'medium';
    return 'low';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Pollution Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pollution Data Records</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Pollution Record</DialogTitle>
              <DialogDescription>
                Enter the pollution measurement data for a specific month and year.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={newRecord.year}
                    onChange={(e) => setNewRecord({...newRecord, year: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={newRecord.month}
                    onChange={(e) => setNewRecord({...newRecord, month: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={newRecord.location}
                  onChange={(e) => setNewRecord({...newRecord, location: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Benzene</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newRecord.benzene}
                    onChange={(e) => setNewRecord({...newRecord, benzene: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Toluene</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newRecord.toluene}
                    onChange={(e) => setNewRecord({...newRecord, toluene: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>NO</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newRecord.no}
                    onChange={(e) => setNewRecord({...newRecord, no: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={handleAddRecord} className="w-full">
                Add Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Benzene (μg/m³)</TableHead>
                <TableHead>Toluene (μg/m³)</TableHead>
                <TableHead>NO (μg/m³)</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {String(record.month).padStart(2, '0')}/{record.year}
                  </TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.benzene.toFixed(1)}
                      <Badge 
                        variant={getLevelColor(getPollutionLevel(record.benzene, 'benzene')) as any}
                        className="text-xs"
                      >
                        {getPollutionLevel(record.benzene, 'benzene')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.toluene.toFixed(1)}
                      <Badge 
                        variant={getLevelColor(getPollutionLevel(record.toluene, 'toluene')) as any}
                        className="text-xs"
                      >
                        {getPollutionLevel(record.toluene, 'toluene')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.no.toFixed(1)}
                      <Badge 
                        variant={getLevelColor(getPollutionLevel(record.no, 'no')) as any}
                        className="text-xs"
                      >
                        {getPollutionLevel(record.no, 'no')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(record)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pollution Record</DialogTitle>
            <DialogDescription>
              Update the pollution measurement data for a specific month and year.
            </DialogDescription>
          </DialogHeader>
          {editRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={editRecord.year}
                    onChange={(e) => setEditRecord({ ...editRecord, year: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={editRecord.month}
                    onChange={(e) => setEditRecord({ ...editRecord, month: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={editRecord.location}
                  onChange={(e) => setEditRecord({ ...editRecord, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Benzene</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editRecord.benzene}
                    onChange={(e) => setEditRecord({ ...editRecord, benzene: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Toluene</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editRecord.toluene}
                    onChange={(e) => setEditRecord({ ...editRecord, toluene: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>NO</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editRecord.no}
                    onChange={(e) => setEditRecord({ ...editRecord, no: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <Button onClick={handleEditSave} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} records
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};