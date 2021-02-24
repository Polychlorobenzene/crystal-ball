<template>
  <div id="app">
    <magic-ball />
    <br />
    <hr />
    <br />
    <story-partner />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import MagicBall from "./views/MagicBall.vue"
import StoryPartner from "./views/StoryPartner.vue"

@Component({
  components: {
    MagicBall,
    StoryPartner
  }
})
export default class App extends Vue {}
</script>

<style>
@import "./assets/site.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
