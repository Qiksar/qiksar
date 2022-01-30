<template>
  <apexchart
    ref="realtimeChart"
    type="line"
    height="200"
    :options="chartOptions"
    :series="series"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ApexLine',
  data() {
    return {
      series: [
        {
          name: 'Desktops',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 99],
        },
      ],
      chartOptions: {
        colors: ['#FCCF31', '#17ead9', '#f02fc2'],
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1000,
        },
        chart: {
          height: 350,
          type: 'line',
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
        stroke: {
          curve: 'smooth',
        },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
          blur: 5,
          left: -7,
          top: 22,
        },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: 'Line Real Time',
          align: 'left',
          style: {
            color: '#FFF',
          },
        },
        xaxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
          ],
          labels: {
            style: {
              colors: '#fff',
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#fff',
            },
          },
        },
      },
    };
  },
  mounted() {
    // this.setDataLineChart()
  },
  unmounted() {
    // this.setDataLineChart(true)
  },
  methods: {
    getRandomArbitrary(min: number, max: number):number {
      return Math.floor(Math.random() *  (max-min)) + min;
    },
    setDataLineChart(stop: boolean) {
      const interval = setInterval(() => {
        this.series[0].data.splice(0, 1);
        this.series[0].data.push(this.getRandomArbitrary(0, 99));
        this.updateSeriesLine();
      }, 3000);

      if (stop) {
        clearInterval(interval);
      }
    },
    updateSeriesLine() {
      /* eslint-disable */
      const ref = this.$refs.realtimeChart as any;
      if ('updateSeries' in ref) {
        ref.updateSeries(
          [
            {
              data: this.series[0].data,
            },
          ],
          false,
          true
        );
      }
      /* eslint-enable */
    },
  },
});
</script>
