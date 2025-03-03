import { fileURLToPath, URL } from 'node:url';
import vuetify from 'vite-plugin-vuetify';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    
    return {
        optimizeDeps: {
            exclude: ['pdfjs-dist']
          },
        plugins: [
            vue(),
            ckeditor5( { theme: require.resolve( '@ckeditor/ckeditor5-theme-lark' ) } ),
            vuetify({ autoImport: true }),
            
        ],
        build: {
            transpile: ['vuetify'], // Ensure Vuetify is transpiled
          },
        base: command === 'serve' ? '' : '/tasklistdemo/',
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
});
