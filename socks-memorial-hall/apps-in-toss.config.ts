import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "socks-memorial-hall",

  brand: {
    // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    primaryColor: "#4DD0E1"
  },

  permissions: [],
  webBundleDir: "dist"
});
