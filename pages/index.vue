<script setup lang="ts">
import {ChevronDownIcon, ChevronUpIcon, Bars2Icon} from "@heroicons/vue/16/solid";
import {useDropzone} from "vue3-dropzone";
const {getRootProps, getInputProps, open, ...rest} = useDropzone({onDrop});
let imgs = ref<string[]>([]);
let showModal = ref(true);
let intervalScroll = ref();
let scrollSpeed = ref();
function onDrop(acceptFiles: File[]) {
  for (let i = 0; i < acceptFiles.length; i++) imgs.value.push(URL.createObjectURL(acceptFiles[i]));
  showModal.value = false;
}
let setIntervalScroll = () => {
  clearInterval(intervalScroll.value);
  intervalScroll.value = setInterval(() => {
    scrollTo("next");
  }, scrollSpeed.value * 1000);
};
let stopIntervalScroll = () => {
  clearInterval(intervalScroll.value);
};
let scrollTo = (direction: "prev" | "next") => {
  let elInView;
  for (let i = 0; i < imgs.value.length; i++) {
    let el = document.getElementById(imgs.value[i]) as HTMLImageElement;
    const {bottom, height} = el.getBoundingClientRect();
    let isVisible = bottom > height / 2;
    if (isVisible) {
      elInView = imgs.value.indexOf(imgs.value[i]);
      break;
    }
  }
  if (elInView !== undefined) {
    if (direction === "prev" && elInView !== 0) {
      document.getElementById(imgs.value[elInView - 1])?.scrollIntoView({behavior: "smooth", block: "start"});
    } else if (direction === "next") {
      if (elInView !== imgs.value.length - 1) {
        document.getElementById(imgs.value[elInView + 1])?.scrollIntoView({behavior: "smooth", block: "start"});
      } else {
        document.getElementById(imgs.value[0])?.scrollIntoView({behavior: "smooth", block: "start"});
      }
    }
  }
};
onMounted(() => {
  document.body.addEventListener("keypress", x => {
    switch (x.key) {
      case "a":
        scrollTo("prev");
        break;
      case "d":
        scrollTo("next");
        break;
      case "w":
        scrollBy({top: -40, behavior: "smooth"});
        break;
      case "s":
        scrollBy({top: 40, behavior: "smooth"});
        break;
      case " ":
        stopIntervalScroll();
        break;
      case "e":
        document.getElementById("menuBtn")?.click();
    }
  });
});
</script>
<template>
  <div class="min-h-screen bg-gray-700">
    <nav class="flex items-center justify-between border-b border-blue-600 p-2">
      <button class="rounded-lg bg-blue-600 px-4 py-2" @click="showModal = true">open file</button>
      <p class="font-sans">with vue3-dropzone</p>
    </nav>
    <div class="flex flex-col gap-2 !scroll-smooth p-5">
      <p class="text-xl font-bold">images list :</p>
      <div class="flex flex-col justify-center">
        <img v-for="i in imgs" :id="i" :src="i" class="max-w-full my-2 object-fit" />
      </div>
      <div class="fixed bottom-5 right-5 flex flex-col gap-2">
        <Menu>
          <div class="relative">
            <MenuButton>
              <button class="rounded-full bg-blue-600 p-2" id="menuBtn">
                <Bars2Icon class="size-6" />
              </button>
            </MenuButton>
            <MenuItems class="absolute bottom-5 rounded-lg right-10 bg-white text-blue-600 p-4 w-[170px]">
              <div class="flex gap-2 flex-col">
                <p class="text-sm">scroll every :</p>
                <input type="number" class="border border-blue-600 rounded-lg p-1" v-model="scrollSpeed" placeholder="second" maxlength="2" />
              </div>
              <div class="mt-3 flex pr-1 flex-col gap-2">
                <button class="rounded-lg bg-blue-600 px-4 pb-2 pt-1 text-white" @click="setIntervalScroll">go</button>
                <button class="rounded-lg bg-blue-600 px-4 pb-2 pt-1 text-white" @click="stopIntervalScroll">stop</button>
              </div>
            </MenuItems>
          </div>
        </Menu>
        <button @click="scrollTo('prev')" class="rounded-full bg-blue-600 p-2">
          <ChevronUpIcon class="size-6 fill-white" />
        </button>
        <button @click="scrollTo('next')" class="rounded-full bg-blue-600 p-2">
          <ChevronDownIcon class="size-6 fill-white" />
        </button>
      </div>
    </div>
    <ModalGlobalBase :show="showModal" @close="showModal = false">
      <div v-bind="getRootProps()" class="rounded-lg border p-5 [direction:ltr]">
        <input v-bind="getInputProps()" />
        <p>you can drag your file's or folder here too !! <br /></p>
        <button class="mt-9 rounded-lg bg-blue-600 px-4 py-2" @click="open">open your file's or folder</button>
      </div>
    </ModalGlobalBase>
  </div>
</template>
