<template>
  <div>
    <ApexChart v-if="ready" :options="chartOptions" :series="series"></ApexChart>
  </div>    
</template>
  
<script>
import ApexChart from 'vue3-apexcharts'

export default {
    name: 'ProjectChart',
    components: { ApexChart },
    data() {
        return {
            ready: false,
            chartOptions: {
                chart: { type: 'donut' },
                labels: [],
                fill: { type: 'gradient' }
            },
            series: []
        }
    },
    mounted() {
        fetch('/project?limit=1000', {
        method: 'GET' })
        .then((res) => {
          res.json()
            .then((data) => {
              this.series = data.map(project => project.members)
              this.chartOptions.labels = data.map(project => project.name)
              this.ready = true
            })
            .catch(err => console.error(err.message))
        })
        .catch(err => console.error(err.message))
    }
}
</script>