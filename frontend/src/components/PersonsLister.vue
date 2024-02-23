<template>
  <div v-if="checkIfInRole(user, [ 0, 1 ])">
    <v-card variant="text">
      <v-card-title>Persons</v-card-title>
      <v-card-subtitle>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field variant="solo" label="Search" v-model="search" @input="retrieve"></v-text-field>
            </v-col>
            <v-col cols="3">
              <v-select v-model="education" label="Education" :items="[ { value: 0, title: 'primary' }, { value: 1, title: 'secondary' }, { value: 2, title: 'high' } ]" chips multiple @update:modelValue="retrieve">
              </v-select>
            </v-col>
            <v-col cols="2">
              <v-text-field variant="solo" type="number" label="Skip" v-model="skip" @input="retrieve"></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field variant="solo" type="number" label="Limit" v-model="limit" @input="retrieve"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-subtitle>
      <v-card-text>
        <v-table density="compact" hover>
          <thead>
            <tr>
              <th class="text-left">
                First name
              </th>
              <th class="text-left">
                Last name
              </th>
              <th class="text-right">
                Birth date
              </th>
              <th class="text-left">
                Education
              </th>
              <th class="text-left">
                Projects
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(person, index) in persons" :key="index" @click="checkIfInRole(user, [ 1 ]) && click(person)">
              <td>{{ person.firstName }}</td>
              <td>{{ person.lastName }}</td>
              <td class="text-right">{{ new Date(person.birthDate).toLocaleDateString() }}</td>
              <td><v-chip>{{ [ 'primary', 'secondary', 'high' ][person.education] }}</v-chip></td>
              <td>
                <v-chip :color="project.color" v-for="(project, pindex) in person.projects" :key="pindex">
                  {{ project.shortcut }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="elevated" color="success" @click="add" v-if="checkIfInRole(user, [ 1 ])">Add</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="editor" width="50%">
      <PersonEditor :id="id" @dataChanged="retrieve" @cancel="cancel"/>
    </v-dialog>
  </div>
</template>

<script>
import common from '../mixins/common'
import PersonEditor from './PersonEditor.vue'

export default {
  name: 'PersonsLister',
  components: { PersonEditor },
  props: [ 'user' ],
  mixins: [ common ],
  methods: {
    retrieve() {
      this.id = null
      this.editor = false
      fetch('/person?search=' + this.search + '&education=' + JSON.stringify(this.education) + '&skip=' + this.skip + '&limit=' + this.limit, {
        method: 'GET' })
        .then((res) => {
          res.json()
            .then((data) => {
              this.persons = data
            })
            .catch(err => console.error(err.message))
        })
        .catch(err => console.error(err.message))
    },
    add() {
      this.id = null
      this.editor = true
    },
    click(row) {
      this.id = row._id
      this.editor = true
    },
    cancel() {
      this.id = null
      this.editor = false
    }
  },
  data() {
    return {
      editor: false,
      persons: [],
      id: null,
      search: '',
      education: [ 0, 1, 2 ],
      skip: 0,
      limit: 10
    }
  },
  mounted() {
    this.retrieve()
  } 
}
</script>