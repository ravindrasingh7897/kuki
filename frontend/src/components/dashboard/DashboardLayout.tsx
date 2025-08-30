import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, BarChart3, Table2, Filter, Activity } from "lucide-react";
import { DataTable } from "./DataTable";
import { PollutionChart } from "./PollutionChart";
import { DataFilters, FilterState } from "./DataFilters";

import { apiUrl } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type PollutionRecord = {
  id: string;
  year: number;
  month: number;
  location: string;
  benzene: number;
  toluene: number;
  no: number;
};

interface DashboardLayoutProps {
  onLogout: () => void;
}

export const DashboardLayout = ({ onLogout }: DashboardLayoutProps) => {
  const [data, setData] = useState<PollutionRecord[]>([]);
  const [filteredData, setFilteredData] = useState<PollutionRecord[]>([]);
  const buildQuery = (filters: FilterState) => {
    switch (filters.filterType) {
      case 'single-year':
        return `?year=${filters.year}`;
      case 'year-range':
        return `?startYear=${filters.startYear}&endYear=${filters.endYear}`;
      case 'year-month-range':
        return `?year=${filters.year}&startMonth=${filters.startMonth}&endMonth=${filters.endMonth}`;
      default:
        return '?year=2021';
    }
  };

  const fetchData = async (query = buildQuery(filters)) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(apiUrl(`/api/data${query}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const json = await response.json();
      setData(json);
      setFilteredData(json);
    } catch (err: any) {
      toast({
        title: "Failed to load data",
        description: err.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    filterType: 'single-year',
    year: '2021',
    startYear: '2020',
    endYear: '2021',
    startMonth: '1',
    endMonth: '12',
  });
  const { toast } = useToast();

  const applyFilters = () => {
    fetchData(buildQuery(filters));
  };

  const handleEdit = async (record: PollutionRecord) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        year: record.year,
        month: record.month,
        location: record.location,
        Benzene: record.benzene,
        Toluene: record.toluene,
        NO: record.no,
      };
      const response = await fetch(apiUrl(`/api/data/${record.id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update record");
      await fetchData();
      toast({ title: "Record updated", description: "Pollution record has been updated successfully." });
    } catch (err: any) {
      toast({ title: "Failed to update record", description: err.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(apiUrl(`/api/data/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete record");
      await fetchData();
      toast({ title: "Record deleted", description: "Pollution record has been deleted successfully." });
    } catch (err: any) {
      toast({ title: "Failed to delete record", description: err.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (newRecord: Omit<PollutionRecord, 'id'>) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        year: newRecord.year,
        month: newRecord.month,
        location: newRecord.location,
        Benzene: newRecord.benzene,
        Toluene: newRecord.toluene,
        NO: newRecord.no,
      };
      const response = await fetch(apiUrl("/api/data"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to add record");
      await fetchData();
      toast({ title: "Record added", description: "New pollution record has been added successfully." });
    } catch (err: any) {
      toast({ title: "Failed to add record", description: err.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Chart data logic
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = filteredData.map(record => ({
    month: `${monthNames[record.month - 1]} ${String(record.year).slice(-2)}`,
    Benzene: record.benzene,
    Toluene: record.toluene,
    NO: record.no,
  }));
  const currentYear = filters.filterType === 'single-year' ? filters.year : 
                     filters.filterType === 'year-month-range' ? filters.year : 
                     `${filters.startYear}-${filters.endYear}`;

  
  const avgBenzene = filteredData.reduce((sum, record) => sum + record.benzene, 0) / filteredData.length || 0;
  const avgToluene = filteredData.reduce((sum, record) => sum + record.toluene, 0) / filteredData.length || 0;
  const avgNO = filteredData.reduce((sum, record) => sum + record.no, 0) / filteredData.length || 0;

  return (
    <div className="min-h-screen bg-gradient-background">
      
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Environmental Monitor</h1>
                <p className="text-sm text-muted-foreground">Pollution Data Dashboard</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-warning/10">
                  <BarChart3 className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Benzene</p>
                  <p className="text-2xl font-bold">{avgBenzene.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">μg/m³</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-secondary/10">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Toluene</p>
                  <p className="text-2xl font-bold">{avgToluene.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">μg/m³</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <BarChart3 className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg NO</p>
                  <p className="text-2xl font-bold">{avgNO.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">μg/m³</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Table2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold">{filteredData.length}</p>
                  <p className="text-xs text-muted-foreground">entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-1">
            <DataFilters
              filters={filters}
              onFiltersChange={setFilters}
              onApplyFilters={applyFilters}
              loading={loading}
            />
          </div>

          
          <div className="lg:col-span-3">
            <Tabs defaultValue="chart" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Charts
                </TabsTrigger>
                <TabsTrigger value="table" className="flex items-center gap-2">
                  <Table2 className="h-4 w-4" />
                  Data Table
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chart">
                <PollutionChart
                  data={chartData}
                  year={currentYear}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="table">
                <DataTable
                  data={filteredData}
                  loading={loading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};