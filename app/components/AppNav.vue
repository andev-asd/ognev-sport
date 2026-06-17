<template>
  <nav class="site-nav">
    <div class="wm" @click="navigateTo(localePath('/'))">
      <svg class="nav-logo" viewBox="0 0 586 171" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="OgnevSport">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M234.214 21.9639H284.17L301.774 41.1918V21.9639H458.51L477.875 57.2658L497.239 21.9639H557.731L503.362 120.94H307.843L290.239 101.711V120.94H170.445C160.297 120.94 150.014 118.749 142.794 113.212C135.574 118.749 125.292 120.94 115.144 120.94H67.8539C49.3445 120.94 30.3818 113.649 30.3818 92.0592V50.8459C30.3818 29.255 49.3429 21.9639 67.8539 21.9639H115.144C125.292 21.9639 135.574 24.1549 142.794 29.6917C150.014 24.1549 160.297 21.9639 170.445 21.9639H234.214ZM430.267 52.7578H393.496L352.325 45.38V47.0501L386.449 57.2004V61.6779H430.805L440.828 81.6479H386.449V85.7712L352.325 94.6328V96.087L392.771 90.1457H444.835L454.901 110.116H352.325V32.7878H454.887L480.587 79.8491L480.631 79.7699L499.573 110.06L499.542 110.116H461.632C451.178 90.9956 440.722 71.877 430.267 52.7578ZM481.453 78.2631L506.287 32.7878H541.828L502.628 104.473L481.453 78.2631ZM40.0129 92.0587V50.8459C40.0129 38.2608 50.2849 34.0384 60.8275 33.0423L74.1049 58.9103L74.1381 58.8546V86.6687L74.1049 86.6371L40.2835 95.4227C40.1057 94.374 40.0129 93.2547 40.0129 92.0587ZM62.1284 32.9357C63.5946 32.8328 65.0579 32.7878 66.4918 32.7878H113.568C123.502 32.7878 134.855 34.9247 138.696 43.7821L103.162 52.7578H77.7835L62.1284 32.9357ZM139.062 44.7058C139.698 46.4897 140.046 48.5258 140.046 50.8459V92.0587C140.046 104.521 129.971 108.783 119.538 109.831L105.922 87.4076V57.1222L139.062 44.7058ZM117.496 109.997C116.176 110.079 114.86 110.116 113.568 110.116H66.4918C55.7863 110.116 43.4315 107.633 40.6093 96.9321L77.8129 90.1457H100.893L117.496 109.997ZM209.039 90.1457V84.753L242.968 89.0081L243.165 88.7708V110.116H170.954C160.63 110.116 148.772 107.809 145.409 98.0456L181.446 90.1457H209.039ZM145.066 96.9112C144.682 95.4511 144.476 93.8392 144.476 92.0587V50.8459C144.476 39.0881 153.439 34.6305 163.213 33.2829L178.602 55.8662V85.3956L178.405 85.0665L145.066 96.9112ZM166.824 32.919C168.212 32.8274 169.596 32.7878 170.954 32.7878H243.077V52.7578H182.949L166.824 32.919ZM209.039 79.3583V79.3123H208.843H191.554V59.3422H243.165V87.4307L209.039 79.3583ZM314.429 67.0887V32.7878H348.552V101.655L314.429 67.0887ZM348.552 110.05V110.116H314.425L283.331 75.9975L247.174 32.8129V32.7878H281.3L312.41 66.9231L312.387 66.9218L348.531 110.116L348.552 110.05ZM281.297 75.7419V110.116H247.174V42.115L281.297 75.7419ZM86.4077 79.3213H96.5896V63.5822H86.4077V79.3213Z" fill="#E53913"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M461.329 134.22V139.626C461.329 143.527 458.472 145.142 455.173 145.746L463.808 156.079H450.58L441.841 145.622V139.447H448.455C448.655 139.447 449.421 139.473 449.421 139.14V134.526C449.421 134.194 448.655 134.22 448.455 134.22H437.749V156.079H425.843V127.708H451.786C454.836 127.708 458.358 128.222 460.148 130.413V127.708H499.736V134.22H485.896V156.079H473.989V134.22H461.329ZM358.55 146.566V156.079H346.644V140.054H369.256C369.457 140.054 370.223 140.079 370.223 139.748V134.526C370.223 134.194 369.457 134.22 369.256 134.22H320.654C320.454 134.22 319.687 134.194 319.687 134.526V137.724C319.687 138.057 320.454 138.03 320.654 138.03H333.725C338.026 138.03 343.266 139.054 343.266 144.362V149.747C343.266 155.054 338.026 156.079 333.725 156.079H307.781V149.567H330.393C330.594 149.567 331.359 149.592 331.359 149.26V144.847C331.359 144.515 330.594 144.542 330.393 144.542H317.322C313.02 144.542 307.781 143.518 307.781 138.21V134.041C307.781 128.733 313.02 127.708 317.322 127.708H372.588C376.89 127.708 382.13 128.732 382.13 134.041V140.234C382.13 145.542 376.89 146.566 372.588 146.566H358.55ZM385.336 149.747V134.041C385.336 128.733 390.575 127.708 394.877 127.708H412.818C417.119 127.708 422.36 128.734 422.36 134.041V149.747C422.36 155.053 417.118 156.079 412.818 156.079H394.877C390.576 156.079 385.336 155.054 385.336 149.747ZM397.242 149.26C397.242 149.592 398.008 149.567 398.21 149.567H409.486C409.687 149.567 410.453 149.592 410.453 149.26V134.526C410.453 134.194 409.686 134.22 409.486 134.22H398.21C398.009 134.22 397.242 134.195 397.242 134.526V149.26Z" fill="#E53913"/>
      </svg>
    </div>

    <!-- Desktop nav links -->
    <div class="nc">
      <NuxtLink class="nb" :to="localePath('/')">{{ t('nav.home') }}</NuxtLink>
      <NuxtLink class="nb" :to="localePath('/equipment')">{{ t('nav.eq') }}</NuxtLink>
      <NuxtLink class="nb" :to="localePath('/contacts')">{{ t('nav.con') }}</NuxtLink>
    </div>

    <!-- Theme toggle -->
    <button class="theme-btn" @click="toggle" :aria-label="theme === 'dark' ? 'Light theme' : 'Dark theme'">
      <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.7"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      </svg>
    </button>

    <!-- Language dropdown -->
    <div class="ldrop" ref="ldropRef">
      <button class="ldrop-btn" :class="{ open: ldropOpen }" @click="ldropOpen = !ldropOpen">
        <span>{{ lang.toUpperCase() }}</span>
        <svg class="ldrop-ch" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="ldrop-panel" :class="{ open: ldropOpen }">
        <button
          v-for="l in (['ua', 'ru', 'en'] as const)"
          :key="l"
          class="ldrop-item"
          :class="{ on: lang === l }"
          @click="setLang(l); ldropOpen = false"
        >
          <span>{{ langLabel[l] }}</span>
          <span class="ldrop-code">{{ l.toUpperCase() }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile hamburger -->
    <button class="hbg" @click="mobOpen = !mobOpen" aria-label="Menu">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
    </button>
  </nav>

  <!-- Mobile menu -->
  <div class="mob-menu" :class="{ open: mobOpen }">
    <NuxtLink class="nb" :to="localePath('/')" @click="mobOpen = false">{{ t('nav.home') }}</NuxtLink>
    <NuxtLink class="nb" :to="localePath('/equipment')" @click="mobOpen = false">{{ t('nav.eq') }}</NuxtLink>
    <NuxtLink class="nb" :to="localePath('/contacts')" @click="mobOpen = false">{{ t('nav.con') }}</NuxtLink>
    <div class="mob-sep"></div>
    <div class="mob-lang-section">
      <div class="mob-lang-label">{{ t('con.langLbl') }}</div>
      <button
        v-for="l in (['ua', 'ru', 'en'] as const)"
        :key="l"
        class="mob-lang-item"
        :class="{ on: lang === l }"
        @click="setLang(l); mobOpen = false"
      >{{ langLabel[l] }}</button>
    </div>
    <div class="mob-sep"></div>
    <button class="mob-theme-item" @click="toggle">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.7"/>
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      </svg>
      <span>{{ t('theme.dark') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{ content: Array<{ key: string; lang: string; value: string }> }>()

const localePath = useLocalePath()
const { theme, toggle } = useTheme()
const { lang, setLang, langLabel } = useLang()
const { t } = useSiteContent(props.content)

const ldropOpen = ref(false)
const mobOpen = ref(false)
const ldropRef = ref<HTMLElement | null>(null)

onClickOutside(ldropRef, () => { ldropOpen.value = false })
</script>
