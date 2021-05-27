<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css"
      />
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Press+Start+2P"
        rel="stylesheet"
      />
      <link href="https://unpkg.com/nes.css/css/nes.css" rel="stylesheet" />
	  <link href="https://unpkg.com/nes.icons@latest/css/nes-icons.min.css" rel="stylesheet" />

    </q-header>
    <q-page-container>
      <b-navbar>
        <template #brand>
          <b-navbar-item @click="redirection" class="nes-pointer">
            <img class="nes-pointer" src="~assets/logo.png" />
          </b-navbar-item>
        </template>
        <template #end>
          <b-navbar-item tag="div">
			<i v-on:click="play" v-if='pause === "play"' class="nes-icon pause"></i>
			<i v-on:click="play" v-if='pause === "pause"' class="nes-icon play"></i>
            <q-media-player
              type="audio"
              ref="audioElements"
              hidden
              :autoplay="true"
              :show-big-play-button="true"
              :sources="audio.sources">
            </q-media-player>
          </b-navbar-item>
        </template>
      </b-navbar>
      <div style="margin-top: 1%;"></div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<style>
html,
body,
pre,
code,
kbd,
samp {
  font-family: 'Press Start 2P';
  -webkit-font-smoothing: none;
}
</style>
<script>
import ChiptuneFantasy from '../assets/Chiptune Fantasy.mp3'

export default {
  name: 'MainLayout',
  data(){
	  return{
		  pause: "play",
      audio: {
        sources: [
          {
            src: ChiptuneFantasy,
            type: 'audio/mp3'
          }
        ]
      }
	  }
  },
  mounted(){
  },
  methods: {
    redirection() {
      location.reload()
    },
	play: function() {
    if (this.pause === "play") {
      this.$refs.audioElements.pause()
      this.pause = "pause"
    }
    else {
      this.$refs.audioElements.play()
      this.$refs.audioElements.currentTime = 0;
      this.pause = "play"
    }
    }
  },
}
</script>
