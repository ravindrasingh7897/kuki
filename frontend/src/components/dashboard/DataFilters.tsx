import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, RotateCcw } from "lucide-react";

export interface FilterState {
  filterType: 'single-year' | 'year-range' | 'year-month-range';
  year: string;
  startYear: string;
  endYear: string;
  startMonth: string;
  endMonth: string;
}

interface DataFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  loading?: boolean;
}

const months = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const years = Array.from({ length: 10 }, (_, i) => (2015 + i).toString());

export const DataFilters = ({ filters, onFiltersChange, onApplyFilters, loading }: DataFiltersProps) => {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      filterType: 'single-year',
      year: '2021',
      startYear: '2020',
      endYear: '2021',
      startMonth: '1',
      endMonth: '12',
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Data Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Filter Type</Label>
          <Select
            value={filters.filterType}
            onValueChange={(value) => updateFilter('filterType', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single-year">Single Year</SelectItem>
              <SelectItem value="year-range">Year Range</SelectItem>
              <SelectItem value="year-month-range">Year + Month Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filters.filterType === 'single-year' && (
          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={filters.year} onValueChange={(value) => updateFilter('year', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {filters.filterType === 'year-range' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Year</Label>
              <Select value={filters.startYear} onValueChange={(value) => updateFilter('startYear', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>End Year</Label>
              <Select value={filters.endYear} onValueChange={(value) => updateFilter('endYear', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {filters.filterType === 'year-month-range' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Year</Label>
              <Select value={filters.year} onValueChange={(value) => updateFilter('year', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Month</Label>
                <Select value={filters.startMonth} onValueChange={(value) => updateFilter('startMonth', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>End Month</Label>
                <Select value={filters.endMonth} onValueChange={(value) => updateFilter('endMonth', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={onApplyFilters} disabled={loading} className="flex-1">
            {loading ? "Applying..." : "Apply Filters"}
          </Button>
          <Button variant="outline" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};