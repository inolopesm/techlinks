// https://stackoverflow.com/questions/43537520/how-do-i-extract-a-type-from-an-array-in-typescript
export type Unpacked<T> = T extends (infer U)[] ? U : T
