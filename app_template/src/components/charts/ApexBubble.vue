<template>
  <apexchart
    type="bubble"
    height="230"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

type TNumberOrString = number | string;

type TSeriesDataItem = [
  x: TNumberOrString,
  y: TNumberOrString,
  z: TNumberOrString
];

type TSeriesData = Array<TSeriesDataItem>;

type TSeries = {
  name: string;
  data: TSeriesData;
};

type TSeriesList = Array<TSeries>;

type IRange = {
  min: number;
  max: number;
};

export default defineComponent({
  name: 'ApexBubble',
  data() {
    return {
      series: [
        {
          name: 'Bubble1',
          data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 60,
          }) as TSeriesData,
        },
        {
          name: 'Bubble2',
          data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 60,
          }) as TSeriesData,
        },
        {
          name: 'Bubble3',
          data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 60,
          }) as TSeriesData,
        },
        {
          name: 'Bubble4',
          data: this.generateData(new Date('11 Feb 2017 GMT').getTime(), 20, {
            min: 10,
            max: 60,
          }) as TSeriesData,
        },
      ] as TSeriesList,
      chartOptions: {
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'vertical',
            shadeIntensity: 0.5,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 0.8,
            stops: [0, 100],
          },
        },
        grid: {
          show: true,
          strokeDashArray: 0,
          xaxis: {
            lines: {
              show: true,
            },
          },
        },
        title: {
          text: 'Bubble',
          align: 'left',
          style: {
            color: '#FFF',
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          labels: {
            colors: '#FFF',
          },
        },
        xaxis: {
          tickAmount: 12,
          type: 'category',
          labels: {
            style: {
              colors: '#fff',
            },
          },
        },
        yaxis: {
          max: 70,
          labels: {
            style: {
              colors: '#fff',
            },
          },
        },
      },
    };
  },
  methods: {
    generateData(baseval: number, count: number, yrange: IRange): TSeriesData {
      let i = 0;
      const series: TSeriesData = [];
      while (i < count) {
        const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
        const y =
          Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
          yrange.min;
        const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

        series.push([x, y, z] as TSeriesDataItem);
        baseval += 86400000;
        i++;
      }
      return series;
    },
  },
});
</script>
