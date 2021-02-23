export default interface IChoice {
  text: string
  index: number
  logprobs: number | undefined | null
  finish_reason: string
}
