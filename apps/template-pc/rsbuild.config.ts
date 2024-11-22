import path, { relative } from 'node:path';

import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginVueJsx } from '@rsbuild/plugin-vue-jsx';
import UnoCSS from '@unocss/postcss';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/rspack';

export default defineConfig({
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginVue(),
    pluginVueJsx(),
    pluginSass({
      // api: 'modern',
      // importers: [new NodePackageImporter()],
      sassLoaderOptions(config) {
        config.additionalData = async (
          content: string,
          loaderContext: string,
        ) => {
          // eslint-disable-next-line unicorn/prefer-module
          const root = path.resolve(__dirname); // 项目根目录
          const relativePath = relative(root, loaderContext);
          // apps下的包注入全局样式
          if (relativePath.startsWith(`apps${path.sep}`)) {
            return `@use "@vben/styles/global" as *;\n${content}`;
          }
          return content;
        };
      },
    }),
    pluginLess({
      lessLoaderOptions: {
        lessOptions: {
          javascriptEnabled: false,
        },
      },
    }),
  ],
  html: {
    template: './public/index.html',
    templateParameters: {
      title: 'iboot',
    },
  },
  source: {
    entry: {
      index: './src/main.ts',
    },
  },
  tools: {
    rspack: {
      plugins: [
        Components({
          resolvers: [
            AntDesignVueResolver({
              importStyle: false, // css in js
            }),
          ],
        }),
      ],
    },
    postcss: () => {
      return {
        postcssOptions: {
          plugins: [UnoCSS()],
        },
      };
    },
  },
});
