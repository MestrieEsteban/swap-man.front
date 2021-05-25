<template>
  <q-page>
    <div class="container is-max-desktop">
      <div v-if="page === 0">
        <div class="columns is-centered">
          <h1 class="titleHome">Welcome in</h1>
        </div>
        <div class="columns is-centered">
          <img src="~assets/logo.png" width="700" height="200" />
        </div>
        <div class="pacman2"></div>
        <div class="marginImage"></div>
        <b-field label="Name User">
          <b-input placeholder="User" v-model="name"></b-input>
        </b-field>
        <div class="marginImage"></div>
        <div class="columns is-centered">
          <div
            role="button"
            class="retro-btn primary nes-pointer"
            @click="RedirectionRoom('create')"
          >
            <a class="btn">
              <span class="btn-inner">
                <span class="content-wrapper">
                  <span class="btn-content">
                    <span class="btn-content-inner" label="Create room"></span>
                  </span>
                </span>
              </span>
            </a>
          </div>
          <div class="marginHome"></div>
          <div
            role="button"
            class="retro-btn success nes-pointer"
            @click="RedirectionRoom('join')"
          >
            <a class="btn">
              <span class="btn-inner">
                <span class="content-wrapper">
                  <span class="btn-content">
                    <span class="btn-content-inner" label="Join room"></span>
                  </span>
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div v-if="page === 1">
        <div class="columns is-centered">
          <h1 class="titleHome">Join a room</h1>
        </div>
        <section>
          <b-field label="Name Room">
            <b-input placeholder="Room" v-model="room"></b-input>
          </b-field>
          <b-button @click="joinRoom" class="is-link">Join room</b-button>
        </section>
      </div>
      <div v-if="page === 2">
        <span class="lobbyCode nes-balloon from-left" v-if="type === 'user1'">
          code lobby :
          <span class="nes-text is-primary">{{ room }}</span>
        </span>
        <div class="marginImage"></div>
        <div class="marginImage"></div>
        <div class="columns is-centered">
          <h1 class="titleHome">Welcome in lobby</h1>
        </div>
        <div class="marginImage"></div>
        <span class="joueur">User 1 : {{ user.user1 }}</span>
        <br />
        <span class="joueur">
          User 2 : {{ user.user2 !== '' ? user.user2 : 'Wating player 2...' }}
        </span>
        <div class="marginImage"></div>
        <div class="columns is-centered" v-if="type === 'user1'">
          <b-button
            class="is-link"
            :disabled="user.user2 === ''"
            @click="start()"
          >
            Start Game
          </b-button>
        </div>
      </div>
	  <div class="is-centered">
      	<div id="game" class="hide"></div>
	  </div>
      <div id="score" style="display: none;"></div>
    </div>
	<div v-if="swapTime === true">
		<span>Swap !</span>
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
      name: '',
      room: '',
      type: null,
      socket: {},
      user: {},
      page: 0,
      playerType: '',
	  swapTime: false,
    }
  },
  mounted() {
    this.setSocket()
    this.socket.on('startGame', () => {
      this.launchGame()
    })
  },
  methods: {
    getRandomString() {
      const randomChars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < 6; i++) {
        result += randomChars.charAt(
          Math.floor(Math.random() * randomChars.length),
        )
      }
      this.room = result
      this.socket.emit('createRoom', this.room, this.name)
      this.type = 'user1'
      this.getLobby()
    },
    RedirectionRoom(type) {
      if (this.name !== '') {
        if (type === 'create') {
          this.playerType = 'p1'
          this.getRandomString()
        } else if (type === 'join') {
          this.playerType = 'p2'
          this.page = 1
        }
      } else {
        alert("Veuillez saisir le nom de l'utilisateur")
      }
    },
    joinRoom() {
      if (this.name !== '' && this.room !== '') {
        this.socket.emit('joinRoom', this.room, this.name)
        this.type = 'user2'
        this.getLobby()
      } else {
        alert('Veuillez saisir le nom de la room')
      }
    },
    getLobby() {
      this.socket.on('user', (user) => {
        this.user = user
      })
      this.page = 2
    },
    start() {
      this.socket.emit('startGame', this.room)
    },
    launchGame() {
      if (this.user.user1 !== '' && this.user.user2 !== '') {
        this.page = 3
        this.startGame()
      } else {
        alert('Tous les joueur ne sont pas connecté')
      }
    },
  },
}
</script>
