export default interface ICompletionResponse {
  id: string
  object: string
  created: number
  model: string
  choices: [
    {
      text: string
      index: number
      logprobs: number|undefined|null      
      finish_reason: string
    }
  ]
}
