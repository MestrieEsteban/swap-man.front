<template>
  <q-page>
    <div class="container is-max-desktop">
      <div class="columns is-centered">
        <h1 class="titleHome"> Welcome in SwapMan</h1>
      </div>
      <div class="columns is-centered">
        <img src="~assets/pacman-hd.png" width="380" height="200"/>
      </div>
      <div class="marginImage"></div>
      <b-field label="Name User">
        <b-input placeholder="User" v-model="name"></b-input>
      </b-field>
      <div class="marginImage"></div>
      <div class="columns is-centered">
        <b-button class="is-link" @click="RedirectionRooms('create')"> Create rooms</b-button>
        <div class="marginHome"></div>
        <b-button class="is-link" @click="RedirectionRooms('join')"> Join rooms</b-button>
      </div>
    </div>
  </q-page>
</template>

<script>
import setSocket from 'src/mixins/socket'

export default {
  name: 'PageIndex',
  mixins: [setSocket],
  data() {
    return {
      name: "",
      rooms: "",
      socket: {}
    }
  },
  mounted() {
    this.setSocket()
  },
  methods: {
    getRandomString() {
      const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
      }
      this.rooms = result
      this.socket.emit("createRoom", this.rooms, this.name);
      this.$router.replace({name: 'ListRoom', params: {id: this.rooms}})
    },
    RedirectionRooms(type) {
      if (this.name !== "") {
        if (type === 'create') {
          this.getRandomString()
        } else if (type === 'join') {
          this.$router.replace({name: 'JoinRoom', params: {name: this.name}})
        }
      } else {
        alert("Veuillez saisir le nom de l'utilisateur")
      }
    },
  }
}
</script>
