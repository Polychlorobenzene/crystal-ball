import ICompletionResponse from "@/interfaces/ICompletionResponse"
import IChoice from "@/interfaces/IChoice"
export default class CompletionResponse implements ICompletionResponse {
  id: string
  object: string
  created: number
  model: string
  contentFilterResponse: string | undefined
  choices: IChoice[]
  fullResponse: ICompletionResponse | undefined | null
  constructor(completionResponse?: ICompletionResponse) {
    if (completionResponse) {
      this.fullResponse = completionResponse
      this.id = completionResponse?.id
      this.object = completionResponse.object
      this.created = completionResponse.created
      this.model = completionResponse.model
      this.choices = completionResponse.choices
    } else {
      this.id = ""
      this.object = ""
      this.created = 0
      this.model = ""
      this.choices = []
    }
  }

  getResponseText(): string {
    if (this.choices.length > 0) return this.choices[0].text
    else return "Response is null."
  }
}
