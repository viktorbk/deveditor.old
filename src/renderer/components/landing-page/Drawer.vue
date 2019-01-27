<template>
  <div>
    <v-navigation-drawer
      v-model="showDrawer"
      width="350"
      absolute
      overflow
      app
    >
    <div style="width:60px;height:100%;background-color:#424242;border-right:1px solid #555;float:left;margin-right:4px">
      <v-btn fab small to="/terminal">
        <v-icon>
          {{ 'mdi-code-greater-than' }}
        </v-icon>
      </v-btn>
    </div>

    <v-layout row wrap>
      <v-flex xs9>
        <v-combobox
          v-model="selectedPrj"
          :items="projects"
          label="Select project or click + to add"
        ></v-combobox>
      </v-flex>
      <v-flex xs3>
        <v-btn small fab style="margin-top:10px" @click="openProject">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-treeview
      :items="treeItems"
      item-key="path" 
      activatable
      open-on-click
      :active.sync="active"
      style="font-size:8px"
    >
      <template slot="prepend" slot-scope="{ item, open, leaf }">
        <v-icon v-if="item.type=='directory'">
          {{ open ? 'mdi-folder-open' : 'mdi-folder-outline' }}
        </v-icon>
        <v-icon v-else>
          {{ getIcon(item.path) }}
        </v-icon>
      </template>
    </v-treeview>
    </v-navigation-drawer>
    <v-toolbar app absolute>
      <v-toolbar-side-icon
        @click.stop="showDrawer = !showDrawer"
      ></v-toolbar-side-icon>
      <v-toolbar-title>MyEditor</v-toolbar-title>
      <v-tabs
        slot="extension"
        v-model="activeTab"
        color="#212121"
      >
      <v-tabs-slider color="yellow"></v-tabs-slider>
        <v-tab
          v-for="tab in tabs"
          :key="tab.text"
          :href="`#${tab.text}`"
          class="text-transform-none"
        >
          <span style="text-transform:none">{{tab.text}}</span>
          <v-btn icon style="margin-left:0px" @click="closeTab(tab.text)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
    </v-toolbar>

    <project-settings-dlg :show="dialog" v-on:close-dialog="dialog=false"/>
  </div>
</template>

<script>
  import languages from '@/assets/data/languages.json'
  import ProjectSettingsDlg from '@/components/landing-page/ProjectSettingsDlg'
  const dirTree = require('directory-tree')
  const path = require('path')
  const { dialog } = require('electron').remote
  const { ipcRenderer } = require('electron')

  export default {
    name: 'drawer',
    props: {
      tabs: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    components: { ProjectSettingsDlg },
    data: () => ({
      projects: [{
        text: 'Current Project',
        value: '/Users/viktor/repos/electron/rn-creator'
      }],
      treeItems: [],
      active: [],
      showDrawer: null,
      dialog: false,
      activeTab: null
    }),
    methods: {
      closeDialog () {
        this.dialog = false
      },
      openProject () {
        dialog.showOpenDialog(null, {title: 'Open Folder', properties: ['openDirectory']}, (dirPath) => {
          if (dirPath && dirPath.length) {
            this.dialog = true
            this.readData(dirPath[0])
          }
        })
      },
      readData (path) {
        const filteredTree = dirTree(path, { exclude: /node_modules/ })
        this.treeItems = []
        filteredTree.children.forEach(itm => {
          this.treeItems.push({
            name: itm.name,
            children: itm.children,
            type: itm.type,
            path: itm.path
          })
        })
      },
      getLanguage (fullPathj) {
        let ext = path.extname(fullPathj).replace('.', '')
        let icon = languages.find(lang => lang.extension === ext)
        return icon ? icon.name : 'text'
      },
      getIcon (fullPathj) {
        let ext = path.extname(fullPathj).replace('.', '')
        let icon = languages.find(lang => lang.extension === ext)
        return icon ? icon.icon : ''
      },
      selectFile () {
        alert('asdf')
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
      },
      selected () {
        if (!this.active.length) return undefined

        var file = this.active[0]
        let fileName = path.basename(file)
        if (this.tabs.length) {
          var fileExists = this.tabs.find((itm) => itm.text === fileName)
          if (fileExists) {
            this.activeTab = file
            return undefined
          }
        }
        this.$emit('file-selected', file)

        setTimeout(() => {
          this.activeTab = fileName
        }, 100)

        return undefined
      },
      selectedFile: {
        get () {
          return null
        },
        set (optionValue) {
          alert(optionValue)
        }
      }
    },
    watch: {
      selected: 'selectFile',
      activeTab: function (newVal, oldval) {
        this.$emit('tabchanged', newVal)
      }
    },
    mounted: function () {
      const vue = this
      ipcRenderer.on('project:created', function (e, path) {
        debugger
        vue.readData(path)
      })
    }
  }
</script>

<style>
  .theme--dark.v-treeview {
    margin-left: 60px!important;
  }
  .v-toolbar__extension{
    height: 32px!important;
    border-top: 1px solid #555;
  }
  .v-toolbar__content {
    height: 40px!important;
  }
  .v-tabs__item {
    padding: 2px 2px 2px 2px!important;
  }
  .v-tabs__container {
    height: 32px!important;
  }
</style>
