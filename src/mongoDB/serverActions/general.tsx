"use server";

import { mongoCollection } from "../operations";

import { Collections } from "../operations";

export async function getDocumentsCount(collection: keyof Collections) {
    try {
        const coll = mongoCollection(collection)?.collection!;
        return await coll.countDocuments();
    } catch (error:any) {
        return null
    }
}