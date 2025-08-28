"use client";
import { useState } from "react";

interface FilterTypeProps {
  filterType: string;
  setFilterType: (type: string) => void;
  year: number;
  setYear: (year: number) => void;
  startYear: number;
  setStartYear: (year: number) => void;
  endYear: number;
  setEndYear: (year: number) => void;
  startMonth: number;
  setStartMonth: (month: number) => void;
  endMonth: number;
  setEndMonth: (month: number) => void;
  onApply: () => void;
  onReset: () => void;
}

export default function DataFilters({
  filterType, setFilterType, year, setYear, startYear, setStartYear, endYear, setEndYear, startMonth, setStartMonth, endMonth, setEndMonth, onApply, onReset
}: FilterTypeProps) {
  return (
    <div className="bg-white rounded shadow p-4 mb-6 w-full max-w-xs">
      <h3 className="font-bold mb-2">Data Filters</h3>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Filter Type</label>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full border rounded px-2 py-1">
          <option value="single">Single Year</option>
          <option value="range">Year Range</option>
          <option value="monthRange">Year + Month Range</option>
        </select>
      </div>
      {filterType === "single" && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Year</label>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="w-full border rounded px-2 py-1">
            {[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}
      {filterType === "range" && (
        <div className="mb-4 flex gap-2">
          <div>
            <label className="block mb-1 font-medium">Start Year</label>
            <select value={startYear} onChange={e => setStartYear(Number(e.target.value))} className="border rounded px-2 py-1">
              {[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">End Year</label>
            <select value={endYear} onChange={e => setEndYear(Number(e.target.value))} className="border rounded px-2 py-1">
              {[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
      )}
      {filterType === "monthRange" && (
        <>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Year</label>
            <select value={year} onChange={e => setYear(Number(e.target.value))} className="w-full border rounded px-2 py-1">
              {[2015,2016,2017,2018,2019,2020,2021,2022,2023,2024].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="mb-4 flex gap-2">
            <div>
              <label className="block mb-1 font-medium">Start Month</label>
              <select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))} className="border rounded px-2 py-1">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium">End Month</label>
              <select value={endMonth} onChange={e => setEndMonth(Number(e.target.value))} className="border rounded px-2 py-1">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </>
      )}
      <button onClick={onApply} className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition mt-2">Apply Filters</button>
      <button onClick={onReset} className="w-full border border-gray-300 text-gray-700 py-2 rounded font-semibold hover:bg-gray-100 transition mt-2">Reset</button>
    </div>
  );
}
