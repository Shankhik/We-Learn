import { MongoClient } from "mongodb";
let mongoServer : MongoClient;
// var uri = process.env.NODE_ENV==='production'? (process.env.MONGODB_URI||'') : (process.env.MONGODB_URI_DEV||'');
var uri = process.env.MONGODB_URI;
const connect = async ()=>{
    mongoServer = new MongoClient(uri);
    await mongoServer.connect();
}
connect();
export { mongoServer }