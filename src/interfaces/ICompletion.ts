export default interface ICompletion {
  prompt: string
  max_tokens: number
  temperature?: number | undefined
  top_p?: number | undefined
  n?: number | undefined
  stream?: boolean | undefined
  logprobs?: number | undefined
  stop?: string
}
