import IChoice from "@/interfaces/IChoice"

export default interface ICompletionResponse {
  id: string
  object: string
  created: number
  model: string
  contentFilterResponse: string | undefined
  choices: IChoice[]
  //   getResponseText():string{
  // if(this && this.choices && this.choices[0]){
  //   return this.choices
  // }
  //   }
}
