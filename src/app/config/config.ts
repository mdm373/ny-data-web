export type AppConfig = Readonly<{
    apiDomain: string,
    mapsApiKey: string
}>

declare var appConfig: AppConfig

export const getAppConfig = () => appConfig

