<template>
  <div>
    <ApexChart v-if="ready" :options="chartOptions" :series="series"></ApexChart>
  </div>    
</template>
  
<script>
import ApexChart from 'vue3-apexcharts'

export default {
    name: 'PersonChart',
    components: { ApexChart },
    data() {
        return {
            ready: false,
            chartOptions: {
                chart: { type: 'bar' },
                labels: [],
                fill: { type: 'gradient' }
            },
            series: [
              { name: 'Projects', data: [] }
            ]
        }
    },
    mounted() {
        fetch('/person?minProjects=1&limit=10', {
        method: 'GET' })
        .then((res) => {
          res.json()
            .then((data) => {
              this.series[0].data = data.map(person => person.projects.length)
              this.chartOptions.labels = data.map(person => person.firstName + ' ' + person.lastName)
              this.ready = true
            })
            .catch(err => console.error(err.message))
        })
        .catch(err => console.error(err.message))
    }
}
</script>