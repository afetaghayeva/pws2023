<template>
  <div>
    <v-card>
      <v-card-text>
        {{ question }}
      </v-card-text>
      <v-card-actions class="actions">
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="$emit('ok')">Ok</v-btn>
        <v-btn variant="elevated" color="warning" @click="$emit('cancel')">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
    name: 'ConfirmationDialog',
    props: [ 'question' ],
    emits: [ 'ok', 'cancel' ]
}
</script>