'use client';

import { QueryClient } from "@tanstack/react-query"
import { useState } from "react";
import {createAsyncStoragePersister} from "@tanstack/query-async-storage-persister"
import {PersistQueryClientProvider} from "@tanstack/react-query-persist-client"
export default function ReactQueryProvider ({children}:{
    children: React.ReactNode
}){
    const [client] = useState (()=> new QueryClient({
        defaultOptions:{
            queries:{
                gcTime: 60000*3  // 3 minutes
            }
        }
    }))

    const [persister] = useState (()=> createAsyncStoragePersister({
        storage: typeof window !== 'undefined'?window.localStorage:undefined,
    }))
    
    return <PersistQueryClientProvider client={client}
        persistOptions={{
            persister,
            maxAge: 60000*60, // 1 hour
            dehydrateOptions:{
                shouldDehydrateQuery: (query)=>{
                    // doesn't save if meta.persist not found or false
                    if(!query.meta?.persist) {
                        // Removes the existing local storage entry
                        // -> It is no longer needs to persist
                        // client.removeQueries({
                        //     queryKey: query.queryKey
                        // })
                        return false
                    };
                    return true;
                    // const maxAge = query.meta?.maxAge as number;

                    // // No maxAge? Always persist
                    // if (!maxAge) return true;

                    // const updatedAt = query.state.dataUpdatedAt;   // timestamp (ms)
                    // const age = Date.now() - updatedAt;

                    // // Keep only if not expired
                    // return age < maxAge;
                }
            }
        }}
    >
        {children}
    </PersistQueryClientProvider>
}
/* For Auto Delete Local Storage Queries before restore */
/*
const persister = {
  persistClient: (client) => {
    // save normally (React Query handles this)
    realPersister.persistClient(client);
  },

  restoreClient: async () => {
    const cached = await realPersister.restoreClient();

    if (!cached) return undefined;

    const now = Date.now();

    // Filter out expired queries
    cached.clientState.queries = cached.clientState.queries.filter((q) => {
      const maxAge = q.meta?.maxAge;
      if (!maxAge) return true;

      const age = now - q.state.dataUpdatedAt;
      return age < maxAge; // keep only fresh ones
    });

    return cached; // return the cleaned version
  },

  removeClient: () => realPersister.removeClient()
};
*/