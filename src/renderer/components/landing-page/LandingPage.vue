<template>
  <v-app id="sandbox" :dark="dark">
    <drawer :tabs="tabs" @file-selected="selectFile" @tabchanged="activeTabChange"></drawer>
    <v-content class="my-content">
      <v-container fluid>
        <v-layout>
          <v-flex>
            <v-tabs-items v-model="activeTab" mt-5>
              <v-tab-item
                :transition="false" :reverse-transition="false"
                v-for="tab in tabs"
                :key="tab.text"
                :value="tab.text"                
              >
                <editor :value="tab.content"
                        :lang="tab.lang"
                        theme="monokai"
                        width="100%"
                        height="100%"
                        ref="`editor-${tab.text}`"
                        @editor-mounted="editorMounted"
                ></editor>
              </v-tab-item>
            </v-tabs-items>            
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer :inset="footer.inset" app>
      <span class="px-3">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
  import editor from '@/components/editor/Editor'
  import languages from '@/assets/data/languages.json'
  import drawer from '@/components/landing-page/Drawer'

  const fs = require('fs')
  const path = require('path')

  export default {
    name: 'landing-page',
    components: { drawer, editor },
    data: () => ({
      items4: [],
      active: [],
      activeTab: null,
      projects: [{
        text: 'Current Project',
        value: '/Users/viktor/repos/electron/rn-creator'
      }],
      dark: true,
      tabs: [],
      footer: {
        inset: false
      }
    }),
    methods: {
      activeTabChange (tab) {
        this.activeTab = tab
      },
      selectFile (file) {
        fs.readFile(file, 'utf8', (err, data) => {
          if (err) {
            console.log(err)
            return err
          } else {
            let lang = this.getLanguage(file)
            let fileName = path.basename(file)
            let newTab = {
              text: fileName,
              lang: lang,
              content: data,
              path: file
            }
            this.activeTab = fileName
            this.tabs.push(newTab)
          }
        })
      },
      getLanguage (fullPathj) {
        let ext = path.extname(fullPathj).replace('.', '')
        let icon = languages.find(lang => lang.extension === ext)
        return icon ? icon.name : 'text'
      },
      editorMounted (editor) {
        this.editor = editor
      }
    },
    computed: {
      selectedPrj: {
        get () {
          return null
        },
        set (optionValue) {
          this.readData(optionValue.value)
        }
      }
    }
  }
</script>

<style scoped>
  .my-content {
    padding-top: 72px!important;
  }
  .v-icon {
    font-size: 18px!important;
  }
  .v-toolbar__title {
    font-size: 16px!important;
  }
  .v-input, .v-list__tile, .theme--dark.v-label {
    font-size: 14px!important;
  }
  .container {
    padding: 4px!important;
  }
</style>
