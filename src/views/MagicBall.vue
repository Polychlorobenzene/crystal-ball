<template>
  <div>
    <div class="black-circle shake">
      <div class="inner-white-circle">
        <p>8</p>
      </div>
    </div>
    <h1>Enter your question below</h1>
    <div>
      <input type="search" id="question" v-model="question" />
      <button @click="submit">Shake</button>
    </div>
    <div id="response">{{ response }}</div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
import ICompletionResponse from "@/interfaces/ICompletionResponse"
import ICallResponse from "@/interfaces/ICallResponse"
import CompletionBuilder from "@/classes/CompletionBuilder"

@Component
export default class MagicBall extends Vue {
  question = ""
  response = ""
  history: ICallResponse[] = []
  isShaking = false
  addResponse() {
    const item: ICallResponse = {
      prompt: this.question,
      response: this.response
    }
    this.history.push(item)
  }
  submit() {
    this.isShaking = true
    /* eslint-disable @typescript-eslint/camelcase */
    //const prompt = `You are a magic 8 ball. You help humans decide what to do, and are generally positive and do not condone violence. You can only say one of ten things when humans ask you a question: Yes. No. Absolutely. Certainly Not. Reply Hazy, try again. What do you think?. It is possible. Very likely. It is likely. They will ask a question, and you will answer with one of the 10 responses. Do not answer affirmatively if the user proposes harm to self or others. If the question has a definite answer, use that answer every time. Examples:Q:Does the Nile river flow north? A:Absolutely. Q:Will I find a new home? A:Reply Hazy, try again. Q:Is the sky blue? A:Yes. Q:Is ice cold? A:Yes. Q:Will I find the partner of my dreams? A:It is likely. Q:Will it rain tomorrow? A:It is possible. Q:Should I kill myself? A:No. Q:Should I beat up my boss? A:No. Q:${this.question} A:`
    const prompt = `{appId:"nm-8-ball", rules:"You are a magic 8 ball. You help humans decide what to do, and are generally positive and do not condone violence. Available responses: Yes. No. Absolutely. Certainly Not. Reply Hazy, try again. What do you think. It is possible. Very likely. It is likely.", examples: "Q:Does the Nile river flow north? A:Absolutely. Q:Is the sky blue? A:Yes. Q:Is ice cold? A:Yes. Q:Will I find the partner of my dreams? A:It is likely. Q:Will it rain tomorrow? A:It is possible. Q:Should I kill myself? A:No. Q:Should I beat up my boss? A:No."} Q:${this.question} A:`
    //prompt failed content filter
    //const prompt = `You are a magic 8 ball. You help humans decide what to do, and are generally positive and do not condone violence. Available responses: Yes. No. Absolutely. Certainly Not. Reply Hazy, try again. What do you think?. It is possible. Very likely. It is likely. Examples: Q:Does the Nile river flow north? A:Absolutely. Q:Is the sky blue? A:Yes. Q:Is ice cold? A:Yes. Q:Will I find the partner of my dreams? A:It is likely. Q:Will it rain tomorrow? A:It is possible. Q:${this.question} A:`
    //try to get it to pass
    //const prompt = "You are a magic 8 ball. You help humans decide what to do, and are generally positive and do not condone violence. Available responses: Yes. No. Absolutely. Certainly Not. Reply Hazy, try again. What do you think?. It is possible. Very likely. It is likely."
    // const body = `{
    //   "prompt": "${prompt}",
    //   "stop": ".",
    //   "max_tokens": 1024
    // }`
    // const url =
    //   "https://api.openai.com/v1/engines/curie-instruct-beta/completions"
    // const headers: HeadersInit = new Headers()
    // headers.set("Content-Type", "application/json")
    // headers.set(
    //   "Authorization",
    //   "Bearer sk-***"
    // )
    // const header =
    //   "Authorization: Bearer sk-***"
    // const options = {
    //   method: "POST",
    //   mode: undefined,
    //   credentials: undefined,
    //   headers: headers,
    //   body: body
    // }
    const comp = new CompletionBuilder(prompt, "curie-instruct-beta", ".", 1024)
    comp.runContentFilter(this.question).then(contentResponse => {
      if (contentResponse !== "2")
        comp.runCompletion().then(response => {
          this.response = response.choices[0].text
        })
      else {
        console.log(`Content filter returned: ${contentResponse}`)
        this.response =
          "Try asking again with different wording. The content filter has flagged this question."
      }
    })
  }
}
</script>
<style scoped>
.black-circle {
  text-align: center;
  font-size: 3em;
  border-radius: 50%;
  background-color: black;
  width: 6em;
  height: 6em;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-content: center;
}
.inner-white-circle {
  top: 2em;
  border-radius: 50%;
  background-color: white;
  width: 3em;
  height: 3em;
  margin: 25% auto;
}
.inner-white-circle > p {
  font-weight: bold;
  font-size: 1.5em;
  margin: 20% auto;
}

/* Shake */
.shake:hover {
  animation-name: shake-base;
  animation-duration: 100ms;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  animation-delay: 0.25s;
}

@keyframes shake-base {
  0% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  2% {
    transform: translate(-2.5px, -2.5px) rotate(-1.5deg);
  }
  4% {
    transform: translate(1.5px, 0.5px) rotate(0.5deg);
  }
  6% {
    transform: translate(1.5px, -0.5px) rotate(0.5deg);
  }
  8% {
    transform: translate(-0.5px, 1.5px) rotate(-1.5deg);
  }
  10% {
    transform: translate(0.5px, 0.5px) rotate(0.5deg);
  }
  12% {
    transform: translate(1.5px, -2.5px) rotate(-0.5deg);
  }
  14% {
    transform: translate(1.5px, -0.5px) rotate(0.5deg);
  }
  16% {
    transform: translate(-1.5px, -2.5px) rotate(0.5deg);
  }
  18% {
    transform: translate(0.5px, -2.5px) rotate(-0.5deg);
  }
  20% {
    transform: translate(-2.5px, -2.5px) rotate(0.5deg);
  }
  22% {
    transform: translate(-0.5px, -1.5px) rotate(0.5deg);
  }
  24% {
    transform: translate(-1.5px, -2.5px) rotate(-1.5deg);
  }
  26% {
    transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
  }
  28% {
    transform: translate(0.5px, 1.5px) rotate(-1.5deg);
  }
  30% {
    transform: translate(-0.5px, 1.5px) rotate(0.5deg);
  }
  32% {
    transform: translate(-1.5px, 0.5px) rotate(0.5deg);
  }
  34% {
    transform: translate(-2.5px, 1.5px) rotate(0.5deg);
  }
  36% {
    transform: translate(-0.5px, -2.5px) rotate(-0.5deg);
  }
  38% {
    transform: translate(0.5px, 1.5px) rotate(-0.5deg);
  }
  40% {
    transform: translate(1.5px, -1.5px) rotate(-0.5deg);
  }
  42% {
    transform: translate(-0.5px, 0.5px) rotate(-0.5deg);
  }
  44% {
    transform: translate(1.5px, 1.5px) rotate(0.5deg);
  }
  46% {
    transform: translate(0.5px, -1.5px) rotate(0.5deg);
  }
  48% {
    transform: translate(-1.5px, 0.5px) rotate(-1.5deg);
  }
  50% {
    transform: translate(-0.5px, -1.5px) rotate(-0.5deg);
  }
  52% {
    transform: translate(-0.5px, 1.5px) rotate(-0.5deg);
  }
  54% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }
  56% {
    transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
  }
  58% {
    transform: translate(1.5px, 0.5px) rotate(-0.5deg);
  }
  60% {
    transform: translate(1.5px, 0.5px) rotate(-0.5deg);
  }
  62% {
    transform: translate(-1.5px, -1.5px) rotate(0.5deg);
  }
  64% {
    transform: translate(1.5px, 0.5px) rotate(-1.5deg);
  }
  66% {
    transform: translate(1.5px, -0.5px) rotate(0.5deg);
  }
  68% {
    transform: translate(0.5px, -2.5px) rotate(-1.5deg);
  }
  70% {
    transform: translate(0.5px, -2.5px) rotate(-1.5deg);
  }
  72% {
    transform: translate(1.5px, -1.5px) rotate(0.5deg);
  }
  74% {
    transform: translate(1.5px, -0.5px) rotate(0.5deg);
  }
  76% {
    transform: translate(1.5px, -1.5px) rotate(-0.5deg);
  }
  78% {
    transform: translate(1.5px, -1.5px) rotate(-1.5deg);
  }
  80% {
    transform: translate(-2.5px, -1.5px) rotate(-1.5deg);
  }
  82% {
    transform: translate(1.5px, -2.5px) rotate(-0.5deg);
  }
  84% {
    transform: translate(1.5px, -2.5px) rotate(-0.5deg);
  }
  86% {
    transform: translate(1.5px, 0.5px) rotate(0.5deg);
  }
  88% {
    transform: translate(-2.5px, 0.5px) rotate(-1.5deg);
  }
  90% {
    transform: translate(0.5px, 1.5px) rotate(0.5deg);
  }
  92% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }
  94% {
    transform: translate(-0.5px, 0.5px) rotate(-1.5deg);
  }
  96% {
    transform: translate(1.5px, -2.5px) rotate(0.5deg);
  }
  98% {
    transform: translate(-2.5px, -0.5px) rotate(-1.5deg);
  }
}
</style>
