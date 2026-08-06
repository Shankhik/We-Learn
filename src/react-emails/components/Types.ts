export type EmailProps <T extends unknown = unknown> = T & {
    inPreview?: boolean
}
export type WithChildren <T extends unknown = unknown> = T & {
    children?: React.ReactNode
}