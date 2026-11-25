import { defineConfig } from "vite";
import { ember } from "@nullvoxpopuli/ember-vite";
import emberCliServer from "./server/vite.mjs";

export default defineConfig({
  plugins: [ember(), emberCliServer()],
  css: { preprocessorOptions: { scss: { quietDeps: true } } },
});
