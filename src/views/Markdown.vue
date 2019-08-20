<template lang="pug">
v-container
  v-card.pa-3
    .col-12(v-html="md")
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { md } from "@/plugins/render";
import matter from "gray-matter";

@Component
export default class Markdown extends Vue {
  private md: string = "";

  public async mounted() {
    this.createContent();
  }
  
  @Watch('$route', { immediate: true, deep: true })
  private async createContent() {
    const m = matter(await (await fetch(`md/${this.$route.params.filename}.md`)).text());
    this.md = md.md2html(m.content);
  }
}
</script>