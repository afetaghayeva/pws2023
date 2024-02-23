<template>
    <v-form v-model="valid">
        <v-card>
        <v-card-title>
            <span class="text-h5">Login</span>
        </v-card-title>
        <v-card-subtitle>
            Enter credentials
        </v-card-subtitle>
        <v-card-text>
            <v-container>
                <v-text-field label="Username" variant="solo" v-model="creds.username" :rules="[ rules.required ]"></v-text-field>
                <v-text-field label="Password" type="password" variant="solo" v-model="creds.password"></v-text-field>
            </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" size="small" color="success" @click="login" variant="elevated" :disabled="!valid">Login</v-btn>
                <v-btn size="small" @click="$emit('cancel')" variant="elevated">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
  
  </template>
  
  <script>
  export default {
    name: 'LoginForm',
    emits: [ 'loginSuccess', 'loginFailed', 'cancel' ],
    methods: {
      login(event) {
        event.preventDefault()
        fetch('/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.creds)
        })
        .then(res => res.json())
        .then(data => this.$emit('loginSuccess', data))
        .catch(() => this.emit('loginFailed'))
      }
    },
    data() {
      return {
        valid: false,
        rules: {
          required: value => !!value || 'empty value is not allowed'
        },
        creds: {},
      }
    }
  }
  </script>