import { MongoClient } from "mongodb"

let client:MongoClient;
let mongoClientPromise: Promise<MongoClient>;

const uri = process.env.MONGODB_URI;

if (process.env.NODE_ENV !== "production"){
    if (!global._mongoClientPromise){
        client = new MongoClient(uri);
        global._mongoClientPromise = client.connect()
    }
    mongoClientPromise = global._mongoClientPromise;
}else{
    client = new MongoClient(uri);
    mongoClientPromise = client.connect();
}

export default mongoClientPromise;