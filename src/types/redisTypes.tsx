export type RedisType = {
    KeyMap:{
        'user-cred': `user-cred:${string}`,
        'user-track': `user-track:${string}`,
    },  
    UserCredentials: {
        email: string
        displayName: string,
        profilePicture?: number|null,
        admin?: boolean
    },
}

export const redisKeysRegex = {
    "user-cred": /^user-cred:+$/,
    "user-track": /^user-track:+$/,
}