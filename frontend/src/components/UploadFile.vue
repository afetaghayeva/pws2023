<template>
  <div>
    <v-card :prepend-avatar="'/uploads/' + user.username + '.jpg?' + cacheKey">
        <v-card-title>
          Upload avatar
        </v-card-title>
        <v-card-text>
          <file-pond
            ref="pond"
            name="image"
            label-idle="Drop files here or click to browse..."
            :allow-multiple="false"
            :allow-revert="false"
            :allow-process="false"
            accepted-file-types="image/jpeg, image/png"
            server="/files"
            :files="files"
            v-on:processfile="fileProcessed"
            v-on:error="console.log"
            credits=""
          />
        </v-card-text>
    </v-card>
  </div>
</template>
  
<script>
  import vueFilePond from "vue-filepond"
  import "filepond/dist/filepond.min.css"
  import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css"
  import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type"
  import FilePondPluginImagePreview from "filepond-plugin-image-preview"
  
  const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)
  
  export default {
    name: 'UploadFile',
    components: { FilePond },
    props: [ 'user' ],
    data: function () {
        return {
            files: [],
            cacheKey: Date.now()
        }
    },
    methods: {
        fileProcessed() {
            this.$emit('close')
        }
    }
  }
  </script>