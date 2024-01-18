import { defineConfig } from "vite";
import { ViteEjsPlugin } from "vite-plugin-ejs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import liveReload from "vite-plugin-live-reload";
import { glob } from "glob";
import tagGroups from "./public/data/tag-groups.json";
import tagsI18n from "./public/data/tags-i18n.json";
import accountData from "./public/user/0/account.json";
import crafts from "./public/data/crafts.json";

/**
 * 建立一個 vite 插件，將輸出的檔案移動到不同的目錄。
 *
 * @returns {import('vite').Plugin} - vite 插件。
 */
function moveOutputPlugin() {
  return {
    name: "move-output",
    enforce: "post",
    apply: "build",

    /**
     * 使用指定的選項生成 bundle。
     *
     * @param {import('rollup').OutputOptions} options - 生成 bundle 的選項。
     * @param {import('rollup').OutputBundle} bundle - 包含檔案的 bundle 物件。
     * @returns {Promise<void>} - 當 bundle 生成時解析的 promise。
     */
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith("pages/")) {
          const newFileName = fileName.slice("pages/".length);
          bundle[fileName].fileName = newFileName;
        }
      }
    },
  };
}

export default defineConfig({
  // base 的寫法：
  // base: '/Repository 的名稱/'
  base: "/hiCraft/",
  plugins: [
    liveReload(["./modules/**/*.ejs", "./pages/**/*.ejs", "./pages/**/*.html"]),
    ViteEjsPlugin({
      enableCollapseSearch: false,
      tagGroups: tagGroups,
      tagsI18n: tagsI18n,
      interests: accountData.interestTags,
      crafts: crafts,
    }),
    moveOutputPlugin(),
  ],
  server: {
    // 啟動 server 時預設開啟的頁面
    open: "pages/index.html",
  },
  build: {
    // 將 "pages/" 目錄下的所有 HTML 檔案作為輸入，並將打包後的檔案輸出到 "dist" 目錄。
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync("pages/**/*.html")
          .map((file) => [
            path.relative("pages", file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
    },
    outDir: "dist",
  },
});
