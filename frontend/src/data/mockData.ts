export interface PollutionRecord {
  id: string;
  year: number;
  month: number;
  location: string;
  benzene: number;
  toluene: number;
  no: number;
  pm25: number;
  pm10: number;
  so2: number;
  createdAt: string;
  updatedAt: string;
}


export const mockPollutionData: PollutionRecord[] = [

  { id: '1', year: 2021, month: 1, location: 'New Delhi', benzene: 3.2, toluene: 1.8, no: 18.5, pm25: 142, pm10: 198, so2: 12.3, createdAt: '2021-01-15T10:30:00Z', updatedAt: '2021-01-15T10:30:00Z' },
  { id: '2', year: 2021, month: 2, location: 'New Delhi', benzene: 2.9, toluene: 1.6, no: 16.2, pm25: 138, pm10: 185, so2: 11.8, createdAt: '2021-02-15T10:30:00Z', updatedAt: '2021-02-15T10:30:00Z' },
  { id: '3', year: 2021, month: 3, location: 'New Delhi', benzene: 4.1, toluene: 2.2, no: 20.8, pm25: 156, pm10: 215, so2: 14.2, createdAt: '2021-03-15T10:30:00Z', updatedAt: '2021-03-15T10:30:00Z' },
  { id: '4', year: 2021, month: 4, location: 'New Delhi', benzene: 3.8, toluene: 2.0, no: 19.1, pm25: 148, pm10: 202, so2: 13.5, createdAt: '2021-04-15T10:30:00Z', updatedAt: '2021-04-15T10:30:00Z' },
  { id: '5', year: 2021, month: 5, location: 'New Delhi', benzene: 3.5, toluene: 1.9, no: 17.6, pm25: 142, pm10: 195, so2: 12.9, createdAt: '2021-05-15T10:30:00Z', updatedAt: '2021-05-15T10:30:00Z' },
  { id: '6', year: 2021, month: 6, location: 'New Delhi', benzene: 3.0, toluene: 1.7, no: 16.8, pm25: 135, pm10: 180, so2: 11.5, createdAt: '2021-06-15T10:30:00Z', updatedAt: '2021-06-15T10:30:00Z' },
  { id: '7', year: 2021, month: 7, location: 'New Delhi', benzene: 2.8, toluene: 1.5, no: 15.9, pm25: 128, pm10: 172, so2: 10.8, createdAt: '2021-07-15T10:30:00Z', updatedAt: '2021-07-15T10:30:00Z' },
  { id: '8', year: 2021, month: 8, location: 'New Delhi', benzene: 3.2, toluene: 1.8, no: 17.2, pm25: 138, pm10: 186, so2: 12.1, createdAt: '2021-08-15T10:30:00Z', updatedAt: '2021-08-15T10:30:00Z' },
  { id: '9', year: 2021, month: 9, location: 'New Delhi', benzene: 3.6, toluene: 2.1, no: 18.9, pm25: 145, pm10: 195, so2: 13.2, createdAt: '2021-09-15T10:30:00Z', updatedAt: '2021-09-15T10:30:00Z' },
  { id: '10', year: 2021, month: 10, location: 'New Delhi', benzene: 4.2, toluene: 2.4, no: 21.5, pm25: 162, pm10: 225, so2: 15.1, createdAt: '2021-10-15T10:30:00Z', updatedAt: '2021-10-15T10:30:00Z' },
  { id: '11', year: 2021, month: 11, location: 'New Delhi', benzene: 4.8, toluene: 2.7, no: 24.2, pm25: 182, pm10: 255, so2: 17.3, createdAt: '2021-11-15T10:30:00Z', updatedAt: '2021-11-15T10:30:00Z' },
  { id: '12', year: 2021, month: 12, location: 'New Delhi', benzene: 4.5, toluene: 2.5, no: 22.8, pm25: 175, pm10: 240, so2: 16.5, createdAt: '2021-12-15T10:30:00Z', updatedAt: '2021-12-15T10:30:00Z' },


  { id: '13', year: 2020, month: 1, location: 'New Delhi', benzene: 3.0, toluene: 1.7, no: 17.8, pm25: 135, pm10: 185, so2: 11.9, createdAt: '2020-01-15T10:30:00Z', updatedAt: '2020-01-15T10:30:00Z' },
  { id: '14', year: 2020, month: 2, location: 'New Delhi', benzene: 2.7, toluene: 1.5, no: 15.5, pm25: 128, pm10: 175, so2: 10.8, createdAt: '2020-02-15T10:30:00Z', updatedAt: '2020-02-15T10:30:00Z' },
  { id: '15', year: 2020, month: 3, location: 'New Delhi', benzene: 2.2, toluene: 1.2, no: 13.2, pm25: 98, pm10: 135, so2: 8.5, createdAt: '2020-03-15T10:30:00Z', updatedAt: '2020-03-15T10:30:00Z' },
  { id: '16', year: 2020, month: 4, location: 'New Delhi', benzene: 1.8, toluene: 1.0, no: 11.5, pm25: 85, pm10: 118, so2: 7.2, createdAt: '2020-04-15T10:30:00Z', updatedAt: '2020-04-15T10:30:00Z' },
  { id: '17', year: 2020, month: 5, location: 'New Delhi', benzene: 2.0, toluene: 1.1, no: 12.8, pm25: 92, pm10: 128, so2: 8.1, createdAt: '2020-05-15T10:30:00Z', updatedAt: '2020-05-15T10:30:00Z' },
  { id: '18', year: 2020, month: 6, location: 'New Delhi', benzene: 2.3, toluene: 1.3, no: 14.2, pm25: 105, pm10: 145, so2: 9.2, createdAt: '2020-06-15T10:30:00Z', updatedAt: '2020-06-15T10:30:00Z' },
];

export const getChartData = (records: PollutionRecord[]) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return records.map(record => ({
    month: monthNames[record.month - 1],
    Benzene: record.benzene,
    Toluene: record.toluene,
    NO: record.no,
  }));
};

export const filterData = (data: PollutionRecord[], filters: any) => {
  return data.filter(record => {
    switch (filters.filterType) {
      case 'single-year':
        return record.year === parseInt(filters.year);
      case 'year-range':
        return record.year >= parseInt(filters.startYear) && record.year <= parseInt(filters.endYear);
      case 'year-month-range':
        return record.year === parseInt(filters.year) && 
               record.month >= parseInt(filters.startMonth) && 
               record.month <= parseInt(filters.endMonth);
      default:
        return true;
    }
  });
};