// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import Layout from "./Layout.vue";
import confetti from "./components/confetti.vue";
import busuanzi from "busuanzi.pure.js";

import VisitorPanel from "./components/VisitorPanel.vue";
import { inBrowser } from "vitepress";
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  // enhanceApp({ app, router, siteData }) {
  //   // ...
  // },
  enhanceApp(ctx) {
    const { app, router, siteData } = ctx;
    app.component("confetti", confetti);
    app.component("VisitorPanel", VisitorPanel);
    if (inBrowser) {
      router.onAfterRouteChanged = () => {
        busuanzi.fetch();
      };
    }
  },
} satisfies Theme
