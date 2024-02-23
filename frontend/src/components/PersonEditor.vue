<template>
  <div>
    <v-card>
      <v-card-title>{{ id ? 'Edit' : 'Create' }} person</v-card-title>
      <v-card-text>
        <v-form v-model="isPersonValid">
          <v-text-field variant="solo" label="First name" v-model="person.firstName" :rules="[ rules.required ]"></v-text-field>
          <v-text-field variant="solo" label="Last name" v-model="person.lastName" :rules="[ rules.required ]"></v-text-field>
          <v-text-field variant="solo" type="date" label="Birth date" v-model="person.birthDate" :rules="[ rules.validBirthDate ]"></v-text-field>
          <v-radio-group label="Education" v-model="person.education" inline>
            <v-radio :value="0" label="primary"></v-radio>
            <v-radio :value="1" label="secondary"></v-radio>
            <v-radio :value="2" label="high"></v-radio>
          </v-radio-group>
          <v-select
            v-model="person.projects" label="Projects"
            :items="projects.map(project => ({ value: project._id, title: project.shortcut, props: { subtitle: project.name + ' ' + project.startDate.slice(0, 10) } }))"
            chips multiple>
          </v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add" :disabled="!isPersonValid" v-if="!id">Add</v-btn>
        <v-btn variant="elevated" color="success" @click="modify" :disabled="!isPersonValid" v-if="id">Modify</v-btn>
        <v-btn variant="elevated" color="error" @click="remove" v-if="id">Remove</v-btn>
        <v-btn variant="elevated" color="warning" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="confirmation" width="auto">
      <ConfirmationDialog :question="'Are you sure to delete \'' + person.firstName + ' ' + person.lastName + '\' ?'" @ok="removeReal" @cancel="confirmation = false"/>
    </v-dialog>
  </div>
</template>

<script>
import ConfirmationDialog from './ConfirmationDialog.vue'

export default {
  name: 'PersonEditor',
  props: [ 'id' ],
  components: { ConfirmationDialog },
  emits: [ 'cancel', 'dataChanged' ],
  methods: {
    add() {
      fetch('/person', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.person) })
        .then((res) => {
          res.json()
            .then(() => {
              this.$emit('dataChanged')
            })
            .catch((err) => console.error(err.message))
        })
        .catch((err) => console.error(err.message))
    },
    modify() {
      fetch('/person?_id=' + this.id, {
          method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.person) })
        .then((res) => {
          res.json()
            .then(() => {
              this.$emit('dataChanged')
            })
            .catch(err => console.error(err.message))
        })
        .catch(err => console.error(err.message))
    },
    remove() {
      this.confirmation = true
    },
    removeReal() {
      this.confirmation = false
      fetch('/person?_id=' + this.id, {
        method: 'DELETE' })
        .then((res) => {
          res.json()
            .then(() => {
              this.$emit('dataChanged')
            })
            .catch((err) => console.error(err.message))
        })
        .catch((err) => console.error(err.message))
    },
    cancel() {
      this.$emit('cancel')
    }
  },
  data() {
    return {
      isPersonValid: false,
      rules: {
        required: value => !!value || 'empty value is not allowed',
        validBirthDate: value => !isNaN(new Date(value)) || 'valid date required'
      },
      person: {},
      dialog: false,
      confirmation: false,
      projects: []     
    }
  },
  mounted() {
    fetch('/project?limit=1000', { method: 'GET'})
    .then(res => res.json())
    .then(data => this.projects = data)
    if(this.id) {
      fetch('/person?_id=' + this.id, { method: 'GET' })
      .then((res) => {
        res.json()
        .then(data => {
          Object.assign(this.person, data)
        })
        .catch((err) => console.error(err.message))
      })
      .catch((err) => console.error(err.message))
    } else {
      this.person = {
        birthDate: new Date().toISOString().slice(0, 10),
        education: 0
      }
    }
  } 
}
</script>