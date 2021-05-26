import io from 'socket.io-client'

export default {
  methods: {
    setSocket() {
      this.socket = io('http://localhost:3000/')
    }
  },
}
