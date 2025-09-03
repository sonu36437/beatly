import Realm from "realm";
export default class DownloadDB extends Realm.Object{
  _id!:Realm.BSON.ObjectID; 
  id!:string;
  title!: string;
  artist!: string;
  artwork!: string;
  url?: string;
  duration?: string;
  createdAt!: Date;


  static schema: Realm.ObjectSchema = {
    name: 'DownloadDB',
    properties: {
      _id: 'objectId',
      id:'string',
      title: 'string',
      artist: 'string',
      artwork: 'string',
      url: 'string?',
      duration: 'string?',
     createdAt: 'date',
    
    },
    primaryKey: 'id',
  };
  static generate(id:string,title:string,artist:string,artwork:string,url?:string,duration?:string) {
    return {
      _id: new Realm.BSON.ObjectId(),
      id,
      title,
      artist,
      artwork,
      url,
      duration,
      createdAt:new Date()
    };
  }

}