<template>
    <v-card variant="text">
        <v-card-title>Chat</v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item v-for="(data, index) in history" :key="index"
                :subtitle="(data.sender || 'not-logged-in') + ' ' + data.timestamp.toLocaleTimeString()"
                :class="(data.sender == user.username ? 'my-message' : 'foreign-message') + ' ' +
                        (data.recipient ? 'unicast' : 'broadcast')">
                    {{ data.message }}
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions>
        <v-row>
            <v-col cols="4">
                <v-text-field variant="solo" label="Recipient" v-model="recipient"></v-text-field>
            </v-col>
            <v-col cols="8">
            <v-form ref="messageinput" v-model="valid">
            <v-text-field variant="solo" label="Message" v-model="message" :rules="[ rules.required ]">
                <template #append-inner>
                    <v-btn type="submit" variant="elevated" color="success" @click="send" :disabled="!valid">Send</v-btn>
                </template>
            </v-text-field>
            </v-form>
            </v-col>
        </v-row>
        </v-card-actions>
    </v-card>
</template>
  
<script>
export default {
    name: 'ChatView',
    props: [ 'user' ],
    data() {
        return {
            connection: null,
            message: '',
            recipient: '',
            history: [],
            valid: false,
            rules: {
                required: value => !!value || 'empty message cannot be sent'
            }
        }
    },
    methods: {
        send() {
            let event = { event: 'CHAT', message: this.message }
            if(this.recipient) {
                event.recipient = this.recipient
            }
            this.connection.send(JSON.stringify(event))
            this.$refs.messageinput.reset()
        }
    },
    mounted() {
        this.connection = new WebSocket('ws://' + window.location.host + '/websocket')
        this.connection.onopen = () => {
            console.log('Websocket connection established')
            setTimeout(() => 
                this.connection.send(JSON.stringify({ event: 'INIT', session: this.user.sessionid || null }))
            , 500)    
        }
        this.connection.onmessage = (event) => {
            let data = {}
            try {
                data = JSON.parse(event.data)
                data.timestamp = new Date(data.timestamp)
            } catch(err) {
                console.error('Broken WS data', event.data)
                return
            }
            console.log('WS data arrived',)
            switch(data.event) {
                case 'CHAT':
                    this.history.push(data)
                    break
            }
       }
    }    
}
</script>
  
<style scoped>
.foreign-message { text-align: left; }
.my-message { text-align: right; }
.unicast { color: black; }
.broadcast { color: green; }
</style>