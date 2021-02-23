<template>
    <button type="submit" @click="download">
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"
@Component
export default class extends Vue{
    @Prop() text!:string
    
}
</script>