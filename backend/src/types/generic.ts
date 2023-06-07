export interface StringIndex {
  [key: string]: string
}

export interface CallbackIndex {
  [key: string]: (props?: {[key: string]: any}) => void | Promise<void | boolean | unknown[]>
}

export interface AnyIndex {
  [key: string]: any
}

export interface StringArrayIndex {
  [key: string]: string[]
}

export interface StringIndexIndex {
  [key: string]: StringIndexIndex | string
}