<template>
  <q-page style="min-height: 10px;">
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
        <div class="marginImage"></div>
        <div class="columns is-centered">
          <div
            role="button"
            class="retro-btn secondary nes-pointer"
            @click="howToPlay()"
          >
            <a class="btn">
              <span class="btn-inner">
                <span class="content-wrapper">
                  <span class="btn-content">
                    <span
                      class="btn-content-inner"
                      label="How to play ?"
                    ></span>
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
    </div>
    <div v-if="swapTime === true">
      <span>Swap !</span>
    </div>

    <div
      v-if="page === 4"
      class="nes-container with-title is-centered"
      style="max-width: 980px; margin: 0 auto;"
    >
      <h1 class="title">How to play ?</h1>
      <div class="marginImage"></div>
      <div class="columns is-centered">
        <span>
          Swap-man is a Pacman clone but in
          <span class="grad1">Multiplayer</span>
          !
          <br />
          Playable with two players with a lobby system
          <br />
          Create a lobby and send the code to your friend !
        </span>
      </div>
      <div class="columns is-centered">
        <span class="lobbyCode nes-balloon from-left">
          code lobby :
          <span class="nes-text is-primary">VS5fe</span>
        </span>
      </div>
      <div class="marginImage"></div>

      <div class="columns is-centered">
        <span>
          The goal of the game is to finish the game as Pacman
        </span>
      </div>
      <br />
      <div class="">
        <span>
          <span style="color: #f2c037;">Player 1</span>
          start as a
          <span style="color: #f2c037;">Pacman</span>,
           his goal is to avoid being hit by
          <span style="color: #cf4040;">Player 2</span>
          and to collect all the marbles on the map
        </span>
      </div>
      <br />
      <div class="">
        <span>
          <span style="color: #cf4040;">Player 2</span>
          start as a
          <span style="color: #cf4040;">Ghost</span>,
          his goal is to chase and hit the
          <span style="color: #f2c037;">Player 1</span>
        </span>
      </div>
      <br />
      <div class="">
        <span>
          If the
          <span style="color: #cf4040;">Ghost</span>
          touche the
          <span style="color: #f2c037;">Pacman</span>,
          <br />
          then a
          <span class="grad1">SWAP</span>
          is performed.
          <br />
          The
          <span style="color: #cf4040;">Ghost</span>
          becomes the
          <span style="color: #f2c037;">Pacman</span>
          and vice versa
        </span>
      </div>
      <br />
      <div class="">
        <span>
          <span style="color: #cf4040;">Ghost</span>
          can cross some red wall present on the map that the
          <span style="color: #f2c037;">Pacman</span>
          cannot cross
        </span>
      </div>
      <br />
      <div class="">
        <img src="~assets/capture.png" width="400" height="200" />
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
    howToPlay() {
      this.page = 4
    },
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
