import { TDoughnutChartData } from '../types'

export const doughnutChartData: TDoughnutChartData = {
  labels: ['North America', 'South America', 'Australia'],
  datasets: [
    {
      label: 'Population (millions)',
      backgroundColor: ['danger', 'info', 'primary'],
      data: [2478, 5267, 734],
    },
  ],
}

export function categoriesDataFormatter(categories: Array<any>) {
  const object = {
    labels: <any>[],
    datasets: <any>[
      {
        label: categories[0].type,
        backgroundColor: <any>[],
        data: <any>[],
      },
    ],
  }
  categories.map((category) => {
    object.labels.push(category.name)
    object.datasets[0].backgroundColor.push(category.color)
    object.datasets[0].data.push(category.total_amount)
  })

  return object
}
