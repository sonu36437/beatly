import { SearchResult } from "./parsers";
import InnertubeSession from "./Session";

export class Innertube {
  private session!: InnertubeSession;

  private haveSession: boolean = false;
  private async getSession(){
    if(!this.haveSession){
      this.session= await InnertubeSession.getInstance();
      this.haveSession=!this.haveSession;
    
    }


  }

  async search(query: string) {
    if(!this.haveSession){
      await this.getSession();
    }
 
    return this.session.searchQuery(query);
  }

  async player(videoId: string) {
    if(!this.haveSession){
      await this.getSession();
    }
    return this.session.fetchStreamingUrl(videoId);
  }
  async fectchSearchContinuation(token:string):Promise<{ results: SearchResult[], continuationToken?: string }>{
    if(!this.haveSession){
      await this.getSession();
    }
    return this.session.fetchSearchContinuation(token);
  }

 
}
