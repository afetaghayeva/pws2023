<template>
    <v-card variant="text">
        <v-card-title>Dashboard</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <ProjectChart/>
                </v-col>
                <v-col cols="6">
                    <PersonChart v-if="checkIfInRole(user, [ 1 ])"/>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
  
<script>
import common from '../mixins/common'

import ProjectChart from './ProjectChart.vue'
import PersonChart from './PersonChart.vue'

export default {
    name: 'DashboardView',
    components: { ProjectChart, PersonChart },
    mixins: [ common ],
    props: [ 'user' ]
}
</script>
  
<style scoped>
</style>