export default class GitHubApi {
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