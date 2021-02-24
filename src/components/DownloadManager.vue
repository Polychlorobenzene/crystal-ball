<template>
  <button v-if="jsonData.length > 0" @click="download">
    {{ buttonText }}
  </button>
</template>
<script lang="ts">
import ICallResponse from "@/interfaces/ICallResponse"
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class DownloadManager extends Vue {
  @Prop() jsonData!: ICallResponse[]
  @Prop({ default: "Download History" }) buttonText!: string
  @Prop({ default: "history.txt" }) fileName!: string

  download() {
    //This seems pretty hacky
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.jsonData))
    )
    element.setAttribute("download", this.fileName)

    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }
}
</script>
