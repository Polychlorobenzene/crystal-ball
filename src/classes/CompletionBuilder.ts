import ICompletion from "@/interfaces/ICompletion"
import ICompletionResponse from "@/interfaces/ICompletionResponse"
import CompletionResponse from "@/classes/CompletionResponse"
import { Secret } from "@/secret.ts"
export default class CompletionBuilder {
  prompt: string
  engine: string
  stop: string
  max_tokens: number
  apiKey: string | undefined
  completion: ICompletion | undefined
  lastResponse: CompletionResponse | undefined
  constructor(
    prompt: string,
    engine: string,
    stop: string,
    max_tokens: number
  ) {
    this.prompt = prompt
    this.engine = engine
    this.stop = stop
    this.max_tokens = max_tokens
    if (Secret) this.apiKey = Secret.key
  }

  getCompletion(): ICompletion {
    const body: ICompletion = {
      prompt: this.prompt,
      stop: this.stop,
      max_tokens: this.max_tokens
    }
    return body
  }
  getHeaders(): HeadersInit {
    const headers: HeadersInit = new Headers()
    headers.set("Content-Type", "application/json")
    headers.set("Authorization", `Bearer ${this.apiKey}`)
    return headers
  }
  runContentFilter(content: string): Promise<string> {
    const contentFilterUrl =
      "https://api.openai.com/v1/engines/content-filter-alpha-c4/completions"
    const filterCompletion: ICompletion = {
      max_tokens: 1,
      temperature: 0.0,
      top_p: 0,
      logprobs: 3,
      prompt: `<|endoftext|>[${content}]\n--\nLabel:`
    }
    const filterOptions = {
      method: "POST",
      mode: undefined,
      credentials: undefined,
      headers: this.getHeaders(),
      body: JSON.stringify(filterCompletion)
    }
    return fetch(contentFilterUrl, filterOptions)
      .then(response => {
        return response.json()
      })
      .then((filter: ICompletionResponse) => {
        console.log(JSON.stringify(filter))
        if (filter && filter.choices) return filter.choices[0].text
        else return ""
      })
  }
  runCompletion(textToFilter?: string | null): Promise<any> {
    const engineUrl = `https://api.openai.com/v1/engines/${this.engine}/completions`
    const options = {
      method: "POST",
      mode: undefined,
      credentials: undefined,
      headers: this.getHeaders(),
      body: JSON.stringify(this.getCompletion())
    }
    let completionResponse = new CompletionResponse()
    if (textToFilter && textToFilter.length > 0) {
      return this.runContentFilter(textToFilter).then(
        (filter: string | undefined) => {
          if (filter !== "2") {
            return fetch(engineUrl, options)
              .then(response => {
                return response.json()
              })
              .then((data: ICompletionResponse) => {
                console.log(JSON.stringify(data))
                completionResponse = new CompletionResponse(data)
                return data
              })
          } else {
            completionResponse.choices = [
              {
                text:
                  "Try again with different wording. The content filter has flagged the content you provided.",
                index: 0,
                logprobs: null,
                finish_reason: "failed content filter"
              }
            ]
            return completionResponse
          }
        }
      )
    } else
      return fetch(engineUrl, options)
        .then(response => {
          return response.json()
        })
        .then((data: ICompletionResponse) => {
          console.log(JSON.stringify(data))
          return data
        })
  }
}
