<template>
  <div v-if="markers.length > 0">
    <v-select variant="solo" label="Project"
          v-model="selected"
          :items="markers.map((item, index) => ({ value: index, title: item.title }))"
          @update:model-value="selectProject"
    />
    <VMap ref="vmap" style="height: 700px;" :center="center" :zoom="zoom" @view-changed="onViewChanged">
      <template v-for="(marker, index) in markers" :key="index">
        <VMapIconMarker ref="vmarker" v-model:latlng="markers[index]"
          :icon-url="require('leaflet/dist/images/marker-icon.png')"
          :icon-retina-url="require('leaflet/dist/images/marker-icon-2x.png')"
          :icon-shadow-url="require('leaflet/dist/images/marker-shadow.png')"
          :icon-size="[28, 46]"
          :icon-anchor="[17, 46]"
          :opacity="index == selected ? 1 : 0.5"
          @mousedown="onMarkerClick(marker, index)"
        ></VMapIconMarker>
      </template>
      <VMapGoogleTileLayer/>
      <VMapZoomControl/>
    </VMap>

    <div v-if="markers.length == 0">
      No projects
    </div>

    <v-snackbar v-model="dataAccessError" color="error" timeout="3000">{{ dataAccessErrorMsg }}</v-snackbar>

  </div>
</template>
    
<script>
// import styles of vue-map-ui
import 'leaflet/dist/leaflet.css'
import 'vue-map-ui/dist/normalize.css'
import 'vue-map-ui/dist/style.css'
import 'vue-map-ui/dist/theme-all.css'

import { VMap, VMapGoogleTileLayer, VMapZoomControl, VMapIconMarker } from 'vue-map-ui'

import common from '../mixins/common'

export default {
  name: 'ProjectsMap',
  components: { VMap, VMapGoogleTileLayer, VMapZoomControl, VMapIconMarker },
  mixins: [ common ],
  data() {
    return {
      center: this.defaultCoords(),
      zoom: 12,
      markers: [],
      selected: 0,
      dataAccessError: false,
      dataAccessErrorMsg: ''
    }
  },
  methods: {
    selectProject() {
      this.center = { lat: this.markers[this.selected].lat, lng: this.markers[this.selected].lng }
      this.$refs.vmap.map.flyTo(this.center)
    },
    onMarkerClick(marker, index) {
      this.selected = index
      this.selectProject()
    },
    onViewChanged(event) {
      this.center = event.center
    },
    onDataAccessFailed(data) {
      this.dataAccessErrorMsg = data
      this.dataAccessError = true
    }
  },
  mounted() {
    fetch('/project?limit=1000', { method: 'GET' })
      .then(res => res.json())
      .then(data => { 
        if(data.error) throw new Error(data.error)
        this.markers = data.map(project => ({
          title: project.name,
          lat: project.coords.lat || this.defaultCoords().lat,
          lng: project.coords.lng || this.defaultCoords().lng
        }))
        if(this.markers.length) {
          this.center = this.markers[0]
        }
      })
      .catch(err => console.log(err.message))
  }
}
</script>
    
<style scoped>
</style>
    