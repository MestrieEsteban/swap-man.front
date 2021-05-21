<template>
  <q-page>
    <div class="container is-max-desktop">
      <div  v-if="page === 0">
        <div class="columns is-centered" >
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
          <b-button class="is-link" @click="RedirectionRoom('create')"> Create room</b-button>
          <div class="marginHome"></div>
          <b-button class="is-link" @click="RedirectionRoom('join')"> Join room</b-button>
        </div>
      </div>
      <div v-if="page === 1">
        <div class="columns is-centered">
          <h1 class="titleHome"> Join a room</h1>
        </div>
        <section>
          <b-field label="Name Room">
            <b-input placeholder="Room" v-model="room"></b-input>
          </b-field>
          <b-button @click="joinRoom" class="is-link"> Join room</b-button>
        </section>
      </div>
      <div v-if="page === 2">
        <span class="lobbyCode" v-if="type === 'user1'"> code lobby : {{room}}</span>
        <div class="columns is-centered" >
          <h1 class="titleHome"> Welcome in lobby</h1>
        </div>
        <div class="marginImage"></div>
        <div class="columns is-centered">
          <h1 class="joueur"> User 1 : {{user.user1}}</h1>
        </div>
        <div class="columns is-centered">
          <h1 class="joueur"> User 2 : {{user.user2}}</h1>
        </div>
        <div class="marginImage"></div>
        <div class="columns is-centered">
        <b-button class="is-link" @click="launchGame" id="start-button"> Start Game</b-button>
        </div>
      </div>
      <div id="grip" class="hide">
      <div id="game"></div>
       <div id="score"></div>
      </div>
    </div>
  </q-page>
</template>

<script>
import setSocket from 'src/mixins/socket'
import index from 'src/components/index'

export default {
  name: 'PageIndex',
  mixins: [setSocket, index],
  data() {
    return {
      name: "",
      room: "",
      type: null,
      socket: {},
      user: {},
      page: 0,
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
      this.room = result
      this.socket.emit("createRoom", this.room, this.name);
      this.type = "user1"
      this.getLobby()
    },
    RedirectionRoom(type) {
      if (this.name !== "") {
        if (type === 'create') {
          this.getRandomString()
        } else if (type === 'join') {
         this.page = 1
        }
      } else {
        alert("Veuillez saisir le nom de l'utilisateur")
      }
    },
    joinRoom() {
      if (this.name !== "" && this.room !== "") {
        this.socket.emit("joinRoom", this.room, this.name)
        this.type = "user2"
        this.getLobby()
      } else {
        alert("Veuillez saisir le nom de la room")
      }
    },
    getLobby()
    {
      this.socket.on('user', (user) => {
        this.user = user
      })
      this.page = 2
    },
    launchGame()
    {
      if (this.user.user1 !== "" && this.user.user2 !== "")
      {
        this.page = 3
        this.startGame()
      }
      else
      {
        alert("Tous les joueur ne sont pas connecté")
      }
    },
  }
}
</script>

