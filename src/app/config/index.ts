export type AppConfig = Readonly<{
    apiDomain: string
}>

declare var appConfig: AppConfig

export const getAppConfig = () => appConfig

