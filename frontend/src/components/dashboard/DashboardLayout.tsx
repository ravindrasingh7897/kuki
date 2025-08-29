import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, BarChart3, Table2, Filter, Activity } from "lucide-react";
import { DataTable } from "./DataTable";
import { PollutionChart } from "./PollutionChart";
import { DataFilters, FilterState } from "./DataFilters";
import { mockPollutionData, getChartData, filterData, PollutionRecord } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  onLogout: () => void;
}

export const DashboardLayout = ({ onLogout }: DashboardLayoutProps) => {
  const [data, setData] = useState<PollutionRecord[]>([]);
  const [filteredData, setFilteredData] = useState<PollutionRecord[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/opengds", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();
        const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
        const mapped = json.map((item: any) => {
          const monthYear = item["Month - Year"] || "";
          const [monthStr, yearStr] = monthYear.split("-");
          const month = monthMap[monthStr] || 1;
          const year = yearStr ? 2000 + parseInt(yearStr) : 2021;
          return {
            id: item._id?.$oid || item._id || Math.random().toString(),
            location: item.City || item.city || "",
            year,
            month,
            benzene: Number(item["Benzene (µg/m3)"]) || 0,
            toluene: Number(item["Toluene (µg/m3)"]) || 0,
            no: Number(item["NO (µg/m3)"]) || 0,
          };
        });
        setData(mapped);
        setFilteredData(mapped.filter(d => d.year === 2021));
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
    setLoading(true);
    const filtered = filterData(data, filters);
    setFilteredData(filtered);
    setLoading(false);
    toast({
      title: "Filters applied",
      description: `Found ${filtered.length} records matching your criteria.`,
    });
  };

  const handleEdit = async (record: PollutionRecord) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const monthAbbrs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const payload = {
        City: record.location,
        "Month - Year": `${monthAbbrs[(record.month || 1) - 1]}-${String(record.year).slice(-2)}`,
        "NO (µg/m3)": record.no,
        "Benzene (µg/m3)": record.benzene,
        "Toluene (µg/m3)": record.toluene,
      };
      const response = await fetch(`/api/opengds/${record.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update record");
      
      const fetchData = async () => {
        const response = await fetch("/api/opengds", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();
        const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
        const mapped = json.map((item: any) => {
          const monthYear = item["Month - Year"] || "";
          const [monthStr, yearStr] = monthYear.split("-");
          const month = monthMap[monthStr] || 1;
          const year = yearStr ? 2000 + parseInt(yearStr) : 2021;
          return {
            id: item._id?.$oid || item._id || Math.random().toString(),
            location: item.City || item.city || "",
            year,
            month,
            benzene: Number(item["Benzene (µg/m3)"]) || 0,
            toluene: Number(item["Toluene (µg/m3)"]) || 0,
            no: Number(item["NO (µg/m3)"]) || 0,
          };
        });
        setData(mapped);
        setFilteredData(filterData(mapped, filters));
      };
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
      const response = await fetch(`/api/opengds/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete record");
      const fetchData = async () => {
        const response = await fetch("/api/opengds", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();
        const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
        const mapped = json.map((item: any) => {
          const monthYear = item["Month - Year"] || "";
          const [monthStr, yearStr] = monthYear.split("-");
          const month = monthMap[monthStr] || 1;
          const year = yearStr ? 2000 + parseInt(yearStr) : 2021;
          return {
            id: item._id?.$oid || item._id || Math.random().toString(),
            location: item.City || item.city || "",
            year,
            month,
            benzene: Number(item["Benzene (µg/m3)"]) || 0,
            toluene: Number(item["Toluene (µg/m3)"]) || 0,
            no: Number(item["NO (µg/m3)"]) || 0,
          };
        });
        setData(mapped);
        setFilteredData(filterData(mapped, filters));
      };
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
      
      const monthAbbrs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const payload = {
        City: newRecord.location,
        "Month - Year": `${monthAbbrs[(newRecord.month || 1) - 1]}-${String(newRecord.year).slice(-2)}`,
        "NO (µg/m3)": newRecord.no,
        "Benzene (µg/m3)": newRecord.benzene,
        "Toluene (µg/m3)": newRecord.toluene,
      };
      const response = await fetch("/api/opengds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to add record");
      
      const fetchData = async () => {
        const response = await fetch("/api/opengds", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const json = await response.json();
        const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
        const mapped = json.map((item: any) => {
          const monthYear = item["Month - Year"] || "";
          const [monthStr, yearStr] = monthYear.split("-");
          const month = monthMap[monthStr] || 1;
          const year = yearStr ? 2000 + parseInt(yearStr) : 2021;
          return {
            id: item._id?.$oid || item._id || Math.random().toString(),
            location: item.City || item.city || "",
            year,
            month,
            benzene: Number(item["Benzene (µg/m3)"]) || 0,
            toluene: Number(item["Toluene (µg/m3)"]) || 0,
            no: Number(item["NO (µg/m3)"]) || 0,
          };
        });
        setData(mapped);
        setFilteredData(filterData(mapped, filters));
      };
      await fetchData();
      toast({ title: "Record added", description: "New pollution record has been added successfully." });
    } catch (err: any) {
      toast({ title: "Failed to add record", description: err.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const chartData = getChartData(filteredData);
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