<template lang="pug">
v-container
  v-card.pa-3
    .col-12(v-html="readme")
    .col-12
      div(style="max-width: 600px; margin: 0 auto;")
        canvas(ref="chart")
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { md } from "@/plugins/render";
import GitHubApi from "@/lib/GitHubApi";
// @ts-ignore
import token from "@/secrets/token.json";
import matter from "gray-matter";
import Chart from "chart.js";
import yaml from "js-yaml";

interface ILang {
  count: number;
  repos: string[];
}

@Component
export default class Home extends Vue {
  private readme: string = "";
  private chart?: Chart;
  private lang: Record<string, ILang> = {};
  private chartData: Record<string, number> = {};

  public async mounted() {
    const m = matter(await (await fetch("README.md")).text());
    this.readme = md.md2html(m.content);

    this.chart = new Chart(this.$refs.chart as HTMLCanvasElement, {
      type: "doughnut",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: []
          }
        ]
      },
      options: {
        tooltips: {
          // @ts-ignore
          yAlign: "center",
          callbacks: {
            label: (tooltipItem, data) => {
              const k = Object.keys(this.chartData)[tooltipItem.index!];
              return (this.lang[k] || {}).repos || "Others";
            }
          }
        },
        layout: {
          padding: {
            bottom: 500
          }
        },
        aspectRatio: 0.5
      }
    });

    this.buildChart();
  }

  public beforeDestroy() {
    this.lang = {};
    this.chart!.destroy();
  }

  private async buildChart() {
    const langYml = yaml.safeLoad(
      await (await fetch(
        "https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml"
      )).text()
    );

    const gh = new GitHubApi(token.github);

    for (const repo of await gh.fetch("/users/patarapolw/repos")) {
      const repoName = (repo as any).name;
      const k = (repo as any).language;

      if (k) {
        this.lang[k] = {
          count: this.lang[k] ? this.lang[k].count + 1 : 1,
          repos: this.lang[k] ? [...this.lang[k].repos, repoName] : [repoName]
        };

        this.chartData = {};
        const total = Object.values(this.lang)
          .map(cr => cr.count)
          .reduce((a, b) => a + b, 0);
        for (const [m, n] of Object.entries(this.lang)) {
          const p = n.count / total;
          if (p < 0.01) {
            this.chartData.Others = p;
          } else {
            this.chartData[m] = p;
          }
        }

        this.chart!.data.labels = Object.keys(this.chartData);
        this.chart!.data.datasets![0].data = Object.values(this.chartData);
        this.chart!.data.datasets![0].backgroundColor = Object.keys(this.chartData).map(
          la => {
            return (langYml[la] || {}).color || "rgba(0, 0, 0, 0.1)";
          }
        );
        this.chart!.update();
      }

      // for (const [k, v] of Object.entries(
      //   await gh.fetch(`/repos/patarapolw/${repoName}/languages`)
      // )) {
      //   this.lang[k] = {
      //     count: this.lang[k] ? this.lang[k].count + (v as number) : (v as number),
      //     repos: this.lang[k] ? [...this.lang[k].repos, repoName] : [repoName]
      //   };

      //   this.chartData = {};
      //   const total = Object.values(this.lang)
      //     .map(cr => cr.count)
      //     .reduce((a, b) => a + b, 0);
      //   for (const [m, n] of Object.entries(this.lang)) {
      //     const p = n.count / total;
      //     if (p < 0.05) {
      //       this.chartData.Others = p;
      //     } else {
      //       this.chartData[m] = p;
      //     }
      //   }

      //   this.chart!.data.labels = Object.keys(this.chartData);
      //   this.chart!.data.datasets![0].data = Object.values(this.chartData);
      //   this.chart!.data.datasets![0].backgroundColor = Object.keys(this.chartData).map(
      //     la => {
      //       return (langYml[la] || {}).color || "rgba(0, 0, 0, 0.1)";
      //     }
      //   );
      //   this.chart!.update();
      // }
    }
  }
}
</script>