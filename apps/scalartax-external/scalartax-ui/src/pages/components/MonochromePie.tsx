import React from 'react';
import ReactApexChart from 'react-apexcharts';

const MonochromePie = ({ seriesData, dataColors }: any) => {
  //var chartMonochromeColors = getChartColorsArray(dataColors);
  //  const series = [25, 15, 44, 55]
  var options: any = {
    chart: {
      height: 300,
      type: 'pie',
    },
    labels: ['State', 'County', 'City', 'Special'],
    theme: {
      monochrome: {
        enabled: true,
        color: 'rgb(55,98,234)',
        shadeTo: 'light',
        shadeIntensity: 0.6,
      },
    },

    plotOptions: {
      pie: {
        dataLabels: {
          offset: -5,
        },
      },
    },
    title: {
      // text: "Monochrome Pie",
      style: {
        fontWeight: 500,
      },
    },
    dataLabels: {
      formatter: function (val: any, opts: any) {
        var name = opts.w.globals.labels[opts.seriesIndex];
        return [name, val.toFixed(1) + '%'];
      },
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      show: false,
    },
  };
  return (
    <>
      <ReactApexChart
        dir="ltr"
        className="apex-charts"
        series={seriesData}
        options={options}
        type="pie"
        height="300px"
      />
    </>
  );
};

export default MonochromePie;
