<script setup lang="ts">
import {ChevronDownIcon, ChevronUpIcon, Bars2Icon} from "@heroicons/vue/16/solid";
import {useDropzone} from "vue3-dropzone";
const {getRootProps, getInputProps, open, ...rest} = useDropzone({onDrop});
let imgs = ref<string[]>([]);
let showModal = ref(true);
let intervalScroll = ref();
let scrollSpeed = ref();
let scrollMethod = ref("section");
function onDrop(acceptFiles: File[]) {
  imgs.value = [];
  acceptFiles.sort((a, b) => {
    let x = a.name;
    let y = b.name;
    if (/\d/.test(x) && /\d/.test(y)) return Number(x.match(/\d/)) - Number(y.match(/\d/));
  });
  for (let i = 0; i < acceptFiles.length; i++) imgs.value.push(URL.createObjectURL(acceptFiles[i]));
  showModal.value = false;
}
let setIntervalScroll = () => {
  clearInterval(intervalScroll.value);
  intervalScroll.value = setInterval(() => {
    scrollMethod.value === "section" ? scrollTo("next") : scrollBy({top: 70, behavior: "smooth"});
  }, scrollSpeed.value * 1000);
};
let stopIntervalScroll = () => clearInterval(intervalScroll.value);
let scrollTo = (direction: "prev" | "next") => {
  let elInView;
  for (let i = 0; i < imgs.value.length; i++) {
    const {bottom, height} = (document.getElementById(imgs.value[i]) as HTMLImageElement).getBoundingClientRect();
    if (bottom > height / 2) {
      elInView = imgs.value.indexOf(imgs.value[i]);
      break;
    }
  }
  if (elInView !== undefined) {
    if (direction === "prev") {
      if (elInView !== 0) document.getElementById(imgs.value[elInView - 1])?.scrollIntoView({behavior: "smooth", block: "start"});
      else document.getElementById(imgs.value.at(-1) as string)?.scrollIntoView({behavior: "smooth"});
    } else {
      if (elInView !== imgs.value.length - 1) document.getElementById(imgs.value[elInView + 1])?.scrollIntoView({behavior: "smooth", block: "start"});
      else document.getElementById(imgs.value[0])?.scrollIntoView({behavior: "smooth", block: "start"});
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
        scrollBy({top: -70, behavior: "smooth"});
        break;
      case "s":
        scrollBy({top: 70, behavior: "smooth"});
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
      <button class="rounded-lg bg-blue-600 px-4 pt-2 pb-3" @click="showModal = true">open file</button>
      <p class="font-sans">with vue3-dropzone</p>
    </nav>
    <div class="flex flex-col gap-2 p-5">
      <p class="text-xl font-bold">images list :</p>
      <div class="flex flex-col justify-center">
        <img v-for="i in imgs" :id="i" :src="i" class="max-w-full my-2 object-fit" />
      </div>
      <div class="fixed bottom-5 right-5 flex flex-col gap-2 text-sm">
        <Menu>
          <div class="relative">
            <MenuButton>
              <button class="rounded-full bg-blue-600 p-3" id="menuBtn">
                <Bars2Icon class="size-7" />
              </button>
            </MenuButton>
            <MenuItems class="absolute bottom-5 rounded-lg right-10 bg-white text-blue-600 p-4 w-[170px]">
              <div class="flex gap-2 flex-col">
                <p>scroll every :</p>
                <input
                  type="number"
                  @keydown="setIntervalScroll"
                  class="border border-blue-600 rounded-lg p-1.5"
                  v-model="scrollSpeed"
                  placeholder="second"
                  maxlength="2" />
              </div>
              <div class="mt-2">
                <RadioGroup v-model="scrollMethod">
                  <RadioGroupLabel>
                    <p class="mb-2">scroll Method:</p>
                  </RadioGroupLabel>
                  <div class="flex *:border *:w-[50%] bg-gray-100 rounded-lg overflow-hidden *:text-center cursor-pointer">
                    <RadioGroupOption v-slot="{checked}" value="section">
                      <div :class="checked ? 'bg-blue-600 text-white' : ''" class="p-2 transition-colors">section</div>
                    </RadioGroupOption>
                    <RadioGroupOption v-slot="{checked}" value="normal">
                      <div :class="checked ? 'bg-blue-600 text-white' : ''" class="p-2 transition-colors">normal</div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
              </div>
              <div class="mt-4 flex pr-1 flex-col gap-2">
                <MenuButton class="rounded-lg bg-blue-600 px-4 pb-2 pt-1 text-white" @click="setIntervalScroll">go</MenuButton>
                <button class="rounded-lg bg-blue-600 px-4 pb-2 pt-1 text-white" @click="stopIntervalScroll">stop</button>
              </div>
            </MenuItems>
          </div>
        </Menu>
        <button @click="scrollTo('prev')" class="rounded-full bg-blue-600 p-3">
          <ChevronUpIcon class="size-7 fill-white" />
        </button>
        <button @click="scrollTo('next')" class="rounded-full bg-blue-600 p-3">
          <ChevronDownIcon class="size-7 fill-white" />
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
