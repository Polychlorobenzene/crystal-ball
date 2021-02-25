<template>
  <div>
    <h1>Story Partner</h1>
    <div>
      <label class="area-label" for="prompt"
        >{{ promptPrefix }} telling the story:</label
      >
      <textarea
        id="prompt"
        name="prompt"
        rows="5"
        cols="30"
        placeholder="I was walking down the street and suddenly..."
        v-model="prompt"
      ></textarea>
    </div>
    <button @click="submit">Submit</button>
    <!-- <div v-if="response.length > 0">
      <label class="area-label" for="response">Response:</label>
      <textarea
        id="response"
        name="response"
        rows="5"
        cols="20"
        class="ai-response"
        v-model="response"
      />
    </div> -->
    <div class="story" id="story">
      <h2 v-if="response.length > 0">The story so far</h2>
    </div>
    <download-manager :jsonData="history" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import DownloadManager from "@/components/DownloadManager.vue"
import ICallResponse from "@/interfaces/ICallResponse"
import CompletionBuilder from "@/classes/CompletionBuilder"
import ICompletionResponse from "@/interfaces/ICompletionResponse"
@Component({
  components: {
    DownloadManager
  }
})
export default class StoryPartner extends Vue {
  prompt = ""
  response = ""
  history: ICallResponse[] = []
  get promptPrefix() {
    return this.history.length === 0 ? "Start" : "Continue"
  }

  addResponse() {
    const item: ICallResponse = {
      prompt: this.prompt,
      response: this.response
    }
    this.history.push(item)
    const story = document.getElementById("story") as HTMLDivElement
    if (story) {
      const q = document.createElement("p")
      q.innerText = this.prompt.toString()
      q.setAttribute("class", "user-response")
      story.appendChild(q)

      if (this.response.length > 0) {
        const r = document.createElement("p")
        r.innerText = this.response
        r.setAttribute("class", "ai-response")
        story.appendChild(r)
      }
      this.prompt = ""
    }
  }
  submit() {
    const prompt1 = `appId:"nm-story-partner", rules:"You are an imaginative writer that wants to work with people to write a story based on their input. You should respond in the same language as the prompt", examples: "I was walking down the street and suddenly the sky went dark with a cloud of starlings swooping overhead. I looked up and saw that the swirling birds were coalescing around an old gnarled oak that seemed out of place on the corner. I could barely make out the outline of a door on the trunk and started to walk toward it. As I approached I could see the glimmer of light escaping from under the door.", prompt:${this.prompt}`
    const prompt2 = `appId:"nm-story-partner", rules:"You are an imaginative writer that wants to work with people to write a story based on their input. You should respond in the same language as the prompt",prompt:${this.prompt}`

    const comp = new CompletionBuilder(
      this.history.length > 0 ? prompt2 : prompt1,
      "curie-instruct-beta",
      "\n\n\n",
      512
    )
    comp.runCompletion(this.prompt).then((response: ICompletionResponse) => {
      this.response = response.choices[0].text
      this.addResponse()
    })
  }
}
</script>
<style>
.user-response {
  text-align: left;
  font-style: italic;
}
.ai-response {
  text-align: right;
  font-weight: bold;
}
.area-label {
  vertical-align: top;
}
</style>
