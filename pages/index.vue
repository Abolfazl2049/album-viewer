<script setup lang="ts">
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/vue/16/solid";
import {useDropzone} from "vue3-dropzone";
const {getRootProps, getInputProps, open, ...rest} = useDropzone({onDrop});
let files = ref<string[]>([]);
let imgInView = ref();
let showModal = ref(true);
function onDrop(acceptFiles: File[]) {
  for (let i = 0; i < acceptFiles.length; i++) {
    let file = acceptFiles[i];
    let url = URL.createObjectURL(file);
    files.value.push(url);
  }
}
</script>
<template>
  <div>
    <div class="min-h-screen bg-gray-700">
      <nav class="flex items-center justify-between border-b border-blue-600 p-2">
        <button class="rounded-lg bg-blue-600 px-4 py-2" @click="showModal = true">open file</button>
        <p class="font-sans">with vue3-dropzone</p>
      </nav>
      <div class="flex flex-col gap-2 !scroll-smooth p-2">
        <img v-for="i in files" :id="i" :src="i" class="max-w-full" />
        <div class="fixed bottom-5 right-5 flex flex-col gap-2 *:rounded-full *:bg-blue-600 *:p-2">
          <button
            @click="
              files ? (imgInView = files[0]) : null,
                navigateTo({
                  hash: '#' + imgInView
                })
            ">
            <ChevronUpIcon class="size-6 fill-white" />
          </button>
          <button>
            <ChevronDownIcon class="size-6 fill-white" />
          </button>
        </div>
      </div>
      <ModalGlobalBase :show="showModal" @close="showModal = false">
        <div v-bind="getRootProps()" class="rounded-lg border p-5 [direction:ltr]">
          <input v-bind="getInputProps()" />
          <p >you can drag your file's or folder here too !! <br /></p>

          <button class="mt-9 rounded-lg bg-blue-600 px-4 py-2" @click="open">open your file's or folder</button>
        </div>
      </ModalGlobalBase>
    </div>
  </div>
</template>
