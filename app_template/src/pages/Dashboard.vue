<template>
  <q-page class="container" style="background: #343e59">
    <div
      class="row q-col-gutter-md q-px-md q-pt-md justify-center"
      key="lineSmall"
    >
      <div class="col-md-3" v-for="i in 4" :key="i">
        <apex-line-small :bgColorCard="colors[i - 1]"></apex-line-small>
      </div>
    </div>
    <div class="row q-col-gutter-md q-px-md q-py-md" key="allCharts">
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-column></apex-column>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <apex-column-with-scroll></apex-column-with-scroll>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-donut></apex-donut>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-line></apex-line>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-line-gradient></apex-line-gradient>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-multiple-radial-bars></apex-multiple-radial-bars>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-heatmap></apex-heatmap>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-radial-bar></apex-radial-bar>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-bubble></apex-bubble>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-radar></apex-radar>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-polar-map></apex-polar-map>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-candle-stick></apex-candle-stick>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-treemap></apex-treemap>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-line-column></apex-line-column>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <apex-line-column-with-scroll></apex-line-column-with-scroll>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-line-scatter></apex-line-scatter>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-area></apex-area>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-bar-charts-grouped></apex-bar-charts-grouped>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-column-charts-basic></apex-column-charts-basic>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-column-with-data-labels></apex-column-with-data-labels>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-line-with-data-labels></apex-line-with-data-labels>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-multiple-yaxis></apex-multiple-yaxis>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-simple-pie-chart></apex-simple-pie-chart>
        </card-base>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12">
        <card-base>
          <apex-stacked-columns-100></apex-stacked-columns-100>
        </card-base>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CardBase from 'components/charts/CardBase.vue';
import ApexLineSmall from 'components/charts/ApexLineSmall.vue';
import ApexColumn from 'components/charts/ApexColumn.vue';
import ApexColumnWithScroll from 'components/charts/ApexColumnWithScroll.vue';
import ApexArea from 'components/charts/ApexArea.vue';
import ApexDonut from 'components/charts/ApexDonut.vue';
import ApexLine from 'components/charts/ApexLine.vue';
import ApexLineGradient from 'components/charts/ApexLineGradient.vue';
import ApexMultipleRadialBars from 'components/charts/ApexMultipleRadialBars.vue';
import ApexHeatmap from 'components/charts/ApexHeatmap.vue';
import ApexRadialBar from 'components/charts/ApexRadialBar.vue';
import ApexBubble from 'components/charts/ApexBubble.vue';
import ApexRadar from 'components/charts/ApexRadar.vue';
import ApexPolarMap from 'components/charts/ApexPolarMap.vue';
import ApexCandleStick from 'components/charts/ApexCandleStick.vue';
import ApexLineColumn from 'components/charts/ApexLineColumn.vue';
import ApexTreemap from 'components/charts/ApexTreemap.vue';
import ApexLineScatter from 'components/charts/ApexLineScatter.vue';
import ApexBarChartsGrouped from 'components/charts/ApexBarChartsGrouped.vue';
import ApexColumnChartsBasic from 'components/charts/ApexColumnChartsBasic.vue';
import ApexColumnWithDataLabels from 'components/charts/ApexColumnWithDataLabels.vue';
import ApexLineColumnWithScroll from 'components/charts/ApexLineColumnWithScroll.vue';
import ApexLineWithDataLabels from 'components/charts/ApexLineWithDataLabels.vue';
import ApexMultipleYaxis from 'components/charts/ApexMultipleYaxis.vue';
import ApexSimplePieChart from 'components/charts/ApexSimplePieChart.vue';
import ApexStackedColumns100 from 'components/charts/ApexStackedColumns100.vue';

export default defineComponent({
  name: 'PageDashboard',
  components: {
    CardBase,
    ApexLineSmall,
    ApexColumn,
    ApexColumnWithScroll,
    ApexArea,
    ApexDonut,
    ApexLine,
    ApexLineGradient,
    ApexMultipleRadialBars,
    ApexHeatmap,
    ApexRadialBar,
    ApexBubble,
    ApexRadar,
    ApexLineColumn,
    ApexTreemap,
    ApexLineScatter,
    ApexBarChartsGrouped,
    ApexColumnChartsBasic,
    ApexColumnWithDataLabels,
    ApexLineColumnWithScroll,
    ApexLineWithDataLabels,
    ApexMultipleYaxis,
    ApexSimplePieChart,
    ApexStackedColumns100,
    ApexCandleStick,
    ApexPolarMap,
  },
  data() {
    return {
      dialog: true,
      colors: [
        'linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)',
        'linear-gradient( 135deg, #2AFADF 10%, #4C83FF 100%)',
        'linear-gradient( 135deg, #FFD3A5 10%, #FD6585 100%)',
        'linear-gradient( 135deg, #EE9AE5 10%, #5961F9 100%)',
      ],
    };
  },
});
</script>
