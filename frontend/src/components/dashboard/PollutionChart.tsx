import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  month: string;
  Benzene: number;
  Toluene: number;
  NO: number;
}

interface PollutionChartProps {
  data: ChartData[];
  year: string;
  loading?: boolean;
}

export const PollutionChart = ({ data, year, loading }: PollutionChartProps) => {
  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Pollution Trends - {year}</CardTitle>
          <CardDescription>Monthly emission levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Pollution Trends - {year}</CardTitle>
        <CardDescription>
          Monthly emission levels (μg/m³) for Benzene, Toluene, and NO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                label={{ value: 'Concentration (μg/m³)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px -2px hsl(var(--foreground) / 0.1)'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Benzene" 
                stroke="hsl(45 93% 47%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(45 93% 47%)', r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(45 93% 47%)' }}
              />
              <Line 
                type="monotone" 
                dataKey="Toluene" 
                stroke="hsl(213 94% 68%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(213 94% 68%)', r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(213 94% 68%)' }}
              />
              <Line 
                type="monotone" 
                dataKey="NO" 
                stroke="hsl(0 84% 60%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(0 84% 60%)', r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(0 84% 60%)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};