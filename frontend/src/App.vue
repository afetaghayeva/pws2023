<template>
  <v-app>
    
    <v-navigation-drawer expand-on-hover rail permanent v-model="showNavigation">
      
      <v-list density="compact" nav>
        <template v-for="item in navigation" :key="item.title">
          <v-list-item :href="item.href" :prepend-icon="item.icon" :title="item.title" exact v-show="checkIfInRole(user, item.roles)"/>
        </template>
      </v-list>

      <v-divider></v-divider>

      <v-list v-if="user.username">
        <v-list-item
          :prepend-avatar="'/uploads/' + user.username + '.jpg?' + cacheKey"
          :title="user.username"
          @click="uploadFileDialog = true"
        >
        </v-list-item>
      </v-list>

      <v-list density="compact" nav>
        <v-list-item key="Login" @click="prepareToLogin" prepend-icon="mdi-login" title="Login" exact v-if="!user.username"/>
        <v-list-item key="Logout" @click="logoutConfirmation = true" prepend-icon="mdi-logout" title="Logout" exact v-if="user.username"/>
      </v-list>

    </v-navigation-drawer>

    <v-main>
      <router-view :user="user"></router-view>
    </v-main>

    <v-dialog v-model="loginDialog" width="25em">
      <Login @cancel="loginDialog = false" @loginFailed="loginDialog = false" @loginSuccess="login"/>
    </v-dialog>

    <v-dialog v-model="logoutConfirmation" width="auto">
      <ConfirmationDialog :question="'Are you sure to logout?'" @ok="logout" @cancel="logoutConfirmation = false"/>
    </v-dialog>

    <v-dialog v-model="uploadFileDialog" width="25em">
      <UploadFile :user="user" @close="closeUploadFileDialog"/>
    </v-dialog>

  </v-app>
</template>

<script>
import common from './mixins/common'
import Login from './components/Login.vue'
import ConfirmationDialog from './components/ConfirmationDialog.vue'
import UploadFile from './components/UploadFile.vue'

export default {
  name: 'App',
  components: { Login, ConfirmationDialog, UploadFile },
  mixins: [ common ],
  data() {
    return {
      navigation: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', href: '#/' },
          { title: 'Persons', icon: 'mdi-account-multiple', href: '#/persons', roles: [ 0, 1 ] },
          { title: 'Projects', icon: 'mdi-sitemap-outline', href: '#/projects' },
          { title: 'Map', icon: 'mdi-map', href: '#/map' },
          { title: 'Chat', icon: 'mdi-chat-processing-outline', href: '#/chat' },
      ],
      showNavigation: false,
      user: {},
      loginDialog: false,
      logoutConfirmation: false,
      uploadFileDialog: false,
      cacheKey: Date.now()
    }
  },
  methods: {
    setUser(data) {
      this.loginDialog = false
      Object.keys(this.user).forEach(key => delete this.user[key])
      Object.assign(this.user, data)
      this.$router.push('/')
      this.showNavigation = true
    },
    logout() {
      this.logoutConfirmation = false
      this.showNavigation = false
      fetch('/auth', { method: 'DELETE' })
      .then(res => res.json())
      .then(data => this.setUser(data))
    },
    prepareToLogin() {
      this.showNavigation = false
      this.loginDialog = true
    },
    login(data) {
      this.loginDialog = false
      this.setUser(data)
    },
    closeUploadFileDialog() {
      this.uploadFileDialog = false
      this.cacheKey = Date.now()
    }
  },
  mounted() {
    fetch('/auth', { method: 'GET' })
    .then(res => res.json())
    .then(data => this.setUser(data))
  }
}
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  margin: 10px 30px;
}
</style>