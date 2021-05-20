<template>
<q-page>
  <div class="container is-max-desktop">
    <div class="columns is-centered">
      <h1 class="titleHome"> Join a room</h1>
    </div>
    <section>
    <b-field label="Name Room">
      <b-input placeholder="Room" v-model="name"></b-input>
    </b-field>
     <b-button @click="joinRoom" class="is-link"> Join rooms </b-button>
    </section>
  </div>
</q-page>
</template>

<script>
export default {
  name: "joinRoom",
  data(){
    return{
      name:""
    }
  },
  methods:{
    joinRoom(){
      if(this.name !== "")
      {
        this.$router.replace({name: 'ListRoom', params: {id: this.name }})
      }
      else {
        alert("Veuillez saisir le nom de la room")
      }
    }
  }
}
</script>

<style scoped>

</style>
