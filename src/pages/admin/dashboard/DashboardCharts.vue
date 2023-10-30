<template>
  <div class="row row-equal">
    <div class="flex xs12 lg6 xl6">
      <va-card v-if="lineChartDataGenerated">
        <va-card-title>
          <h1>{{ t('dashboard.charts.trendyTrends') }}</h1>
          <div>
            <va-button
              class="ma-1"
              size="small"
              color="danger"
              :disabled="datasetIndex === minIndex"
              @click="setDatasetIndex(datasetIndex - 1)"
            >
              {{ t('dashboard.charts.showInLessDetail') }}
            </va-button>
            <va-button
              class="ma-1"
              size="small"
              color="danger"
              :disabled="datasetIndex === maxIndex - 1"
              @click="setDatasetIndex(datasetIndex + 1)"
            >
              {{ t('dashboard.charts.showInMoreDetail') }}
            </va-button>
          </div>
        </va-card-title>
        <va-card-content>
          <va-chart class="chart" :data="lineChartDataGenerated" type="line" />
        </va-card-content>
      </va-card>
    </div>

    <div class="flex xs12 sm6">
      <div class="flex xs12 lg6">
        <va-button-toggle v-model="categoryType" :options="categoryTypes" @click="onCategoryToggle" />
      </div>
      <va-card class="d-flex">
        <!--        <va-card-title>-->
        <!--          <h1>{{ t('dashboard.charts.loadingSpeed') }}</h1>-->
        <!--          <va-button icon="print" plain @click="printChart" />-->
        <!--        </va-card-title>-->
        <va-card-content v-if="doughnutChartDataGenerated">
          <va-chart
            ref="doughnutChart"
            class="chart chart--donut"
            :data="categoriesDataFormatter(categories)"
            type="doughnut"
          />
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { doughnutChartData, lineChartData } from '../../../data/charts'
  import { useChartData } from '../../../data/charts/composables/useChartData'
  import { usePartOfChartData } from './composables/usePartOfChartData'
  import VaChart from '../../../components/va-charts/VaChart.vue'
  import CategoryService from '../../../services/http/CategoryService'
  import { categoriesDataFormatter } from '../../../data/charts/doughnutChartData'
  import { categoryTypes } from '../../../data/categoryTypes'

  const { t } = useI18n()

  const doughnutChart = ref()

  const categoryType = ref<string>('expense')

  const dataGenerated = useChartData(lineChartData, 0.7)
  let categories = ref([])
  let doughnutChartDataGenerated = ref()

  const {
    dataComputed: lineChartDataGenerated,
    minIndex,
    maxIndex,
    datasetIndex,
    setDatasetIndex,
  } = usePartOfChartData(dataGenerated)

  async function getCategories(type: string) {
    const response = await CategoryService.list({ type })
    categories.value = reactive(response)
    doughnutChartDataGenerated.value = useChartData(categoriesDataFormatter(categories.value))
    console.log(response)
  }
  function onCategoryToggle() {
    getCategories(categoryType.value)
  }

  onMounted(() => {
    getCategories(categoryType.value)
  })
  function printChart() {
    const windowObjectReference = window.open('', 'Print', 'height=600,width=800') as Window

    const img = windowObjectReference.document.createElement('img')

    img.src = `${(document.querySelector('.chart--donut canvas') as HTMLCanvasElement | undefined)?.toDataURL(
      'image/png',
    )}`

    img.onload = () => {
      windowObjectReference?.document.body.appendChild(img)
    }

    windowObjectReference.print()

    windowObjectReference.onafterprint = () => {
      windowObjectReference?.close()
    }
  }
</script>

<style scoped>
  .chart {
    height: 400px;
  }
</style>
