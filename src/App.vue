<template lang="pug">
v-app
  v-navigation-drawer(v-model="isDrawerOpened" app)
    v-list(dense)
      v-list-item(to="/")
        v-list-item-content
          v-list-item-title Front Page
      v-list-item(to="/md/pages")
        v-list-item-content
          v-list-item-title GitHub Pages
      v-list-item(to="/md/heroku")
        v-list-item-content
          v-list-item-title Heroku Websites
      v-list-item(to="/md/other-sites")
        v-list-item-content
          v-list-item-title Other Websites
      v-list-item(href="https://polvcode.dev")
        v-list-item-content
          v-list-item-title Blog
  v-app-bar(app collapse)
    v-app-bar-nav-icon(@click.stop="isDrawerOpened = !isDrawerOpened")
    v-spacer
    v-btn.ma-2(text icon href="https://github.com/patarapolw")
      v-icon mdi-github-circle
  v-content
    router-view
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class App extends Vue {
  private isDrawerOpened: boolean = false;
}
</script>

<style lang="scss">
h1 {
  margin-bottom: 0.5em;
}
</style>