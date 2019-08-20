import fetch, { Headers } from "node-fetch";
import token from "@/secrets/token.json";

class GitHubApi {
  private root = "https://api.github.com";
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  public async fetch(p: string, method = "GET", data?: any) {
    const f = await fetch(new URL(p, this.root).href, {
      method, 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `token ${this.token}`
      },
      body: data ? JSON.stringify(data) : undefined
    });

    const result = await f.json();
    
    if (Array.isArray(result)) {
      const link = this.parseLink(f.headers);
      if (link && link.next) {
        result.push(...(await this.fetch(link.next, method, data)));
      }
    }

    return result;
  }

  private parseLink(h: Headers) {
    const link = h.get("link")

    if (!link) {
      return null;
    }

    const output: Record<string, string> = {};
    const regex = /<([^>]+)>; rel="([^"]+)"/g;

    let m: any;
    while (m = regex.exec(link)) {
      const [_, v, k] = m;
      output[k] = v;
    }

    return output;
  }
}

(async () => {
  const gh = new GitHubApi(token.github);
  const lang: Record<string, number> = {};

  for (const repo of await gh.fetch("/users/patarapolw/repos")) {
    for (const [k, v] of Object.entries(await gh.fetch(`/repos/patarapolw/${repo.name}/languages`))) {
      lang[k] = (lang[k] || 0) + (v as number);
    }
  }

  console.log(lang);
})().catch(console.error);
