import { BoundType } from "@gen/nydata-api";

export type BoundDropState = Readonly<{
    selected: BoundType|undefined,
    boundTypes: readonly BoundType[]
}>