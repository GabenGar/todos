export interface IProgress {
  current: number
  total: number
}

export interface IProgressFunction {
  (current: number, total: number): Promise<void>
}