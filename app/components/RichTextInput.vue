<!-- Floating-toolbar contenteditable — analogue of get-hired TextFormatToolbar -->
<template>
  <div class="rt-wrap" ref="containerRef">
    <!-- Toolbar — always mounted, visible only when focused -->
    <div v-if="focused" class="rt-toolbar">
      <button
        type="button"
        class="rt-btn"
        :class="{ 'rt-btn--active': states.bold }"
        @mousedown.prevent="fmt('bold')"
        title="Жирный"
      ><strong>B</strong></button>

      <button
        type="button"
        class="rt-btn"
        :class="{ 'rt-btn--active': states.italic }"
        @mousedown.prevent="fmt('italic')"
        title="Курсив"
      ><em>I</em></button>

      <button
        type="button"
        class="rt-btn rt-btn--accent"
        :class="{ 'rt-btn--active': states.accent }"
        @mousedown.prevent="fmtAccent"
        title="Акцент (оранжевый)"
      ><em>A</em></button>

      <div class="rt-sep"></div>

      <button
        type="button"
        class="rt-btn"
        @mousedown.prevent="fmt('removeFormat')"
        title="Убрать форматирование"
      >T̶</button>
    </div>

    <div
      ref="el"
      contenteditable="true"
      class="rt-ce"
      :class="ceClass"
      :data-placeholder="placeholder"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      @select="syncStates"
      @mouseup="syncStates"
      @keyup="syncStates"
      @keydown.enter="props.singleLine ? $event.preventDefault() : null"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
  ceClass?: string
  singleLine?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [v: string] }>()

const containerRef = ref<HTMLElement | null>(null)
const el = ref<HTMLElement | null>(null)
const focused = ref(false)
const states = reactive({ bold: false, italic: false, accent: false })

// Sync external value into DOM (only when not focused to avoid cursor jump)
watch(() => props.modelValue, (val) => {
  if (el.value && !focused.value && el.value.innerHTML !== val) {
    el.value.innerHTML = val ?? ''
  }
})

onMounted(() => {
  if (el.value) el.value.innerHTML = props.modelValue ?? ''
})

const syncStates = () => {
  states.bold   = document.queryCommandState('bold')
  states.italic = document.queryCommandState('italic')
  // accent = is the current selection inside an <em>?
  const sel = window.getSelection()
  if (sel && sel.anchorNode) {
    let node: Node | null = sel.anchorNode
    states.accent = false
    while (node && node !== el.value) {
      if ((node as Element).tagName === 'EM') { states.accent = true; break }
      node = node.parentNode
    }
  }
}

const onFocus = () => { focused.value = true; syncStates() }
const onBlur  = () => { focused.value = false }

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLElement).innerHTML)
}

const fmt = (cmd: string) => {
  document.execCommand(cmd, false)
  syncStates()
  if (el.value) emit('update:modelValue', el.value.innerHTML)
}

const fmtAccent = () => {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return
  const range = sel.getRangeAt(0)

  // If already in <em>, unwrap
  if (states.accent) {
    document.execCommand('removeFormat', false)
  } else {
    const em = document.createElement('em')
    try {
      range.surroundContents(em)
    } catch {
      const frag = range.extractContents()
      em.appendChild(frag)
      range.insertNode(em)
    }
  }
  syncStates()
  if (el.value) emit('update:modelValue', el.value.innerHTML)
}
</script>

<style scoped>
.rt-wrap {
  position: relative;
}

/* ── Toolbar ── */
.rt-toolbar {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-100%) translateY(-8px);
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  background: #1c1917;
  border: 1px solid #3a3530;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,.5);
  z-index: 100;
  animation: rt-in 60ms ease;
}

@keyframes rt-in {
  from { opacity: 0; transform: translateY(-100%) translateY(-4px) scale(.97); }
  to   { opacity: 1; transform: translateY(-100%) translateY(-8px) scale(1); }
}

.rt-btn {
  padding: 4px 8px;
  border-radius: 5px;
  border: none;
  background: transparent;
  color: #a09080;
  cursor: pointer;
  font-family: inherit;
  font-size: .8rem;
  line-height: 1;
  transition: background .1s, color .1s;
}
.rt-btn:hover   { background: #2e2821; color: #f0ebe3; }
.rt-btn--active { background: rgba(232,88,0,.15); color: #e85800; }
.rt-btn--accent em { color: #e85800; font-style: italic; }

.rt-sep {
  width: 1px;
  height: 16px;
  background: #3a3530;
  margin: 0 2px;
}

/* ── Editable area ── */
.rt-ce {
  outline: none;
  min-height: 1.4em;
  word-break: break-word;
}
.rt-ce:empty::before {
  content: attr(data-placeholder);
  color: #3a3530;
  pointer-events: none;
}
/* Accent color applied by fmtAccent */
.rt-ce :deep(em) { color: #e85800; font-style: italic; }
</style>
