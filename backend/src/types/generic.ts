export interface StringIndex {
  [key: string]: string
}

export interface CallbackIndex {
  [key: string]: (props?: {[key: string]: any}) => void
}

export interface AnyIndex {
  [key: string]: any
}