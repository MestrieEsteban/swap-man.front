import io from 'socket.io-client'

export default {
  methods: {
    setSocket() {
      this.socket = io('https://swapmanback.herokuapp.com')
    }
  },
}
