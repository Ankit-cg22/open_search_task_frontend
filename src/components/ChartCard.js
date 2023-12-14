import { Card, CardContent } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react'

export default function ChartCard({options}) {
  return (
    <Card style={{ marginBottom: '50px', marginRight: '20px' , padding:"0" }}>
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
}
