<template>       
  <div id="app">
     <v-app id="inspire" dark>
      <v-toolbar app fixed clipped-left>
        <v-toolbar-title>Terminal</v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-layout row fill-height>
            <v-flex grow>
            <v-stepper non-linear v-model="e1">
              <v-stepper-header>
                <v-stepper-step :complete="e1 > 1" step="1">Project information</v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step :complete="e1 > 2" step="2">Project template</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3">Create project</v-stepper-step>
              </v-stepper-header>

              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card height="400px">
                    <v-text-field
                      v-model="projectName"
                      label="Project name..."
                    ></v-text-field>
                    <v-text-field
                      v-model="projectFolder"
                      label="Path to the project folder..."
                      append-outer-icon="mdi-folder"
                      @click:append-outer="openFolder()"
                    ></v-text-field>
                    <v-flex mt-3 height="50px">
                      <span>Project type</span>
                      <v-radio-group v-model="projectType" row>
                        <v-radio label="Vue with vuetify" value="VUE"></v-radio>
                        <v-radio label="React Native" value="RN"></v-radio>
                        <v-radio label="Electron" value="EL"></v-radio>
                      </v-radio-group>
                    </v-flex>
                  </v-card>
                  <v-flex class="text-xs-right" mt-5>
                    <v-btn
                      color="primary"
                      @click="e1 = 2"
                    >
                      Next
                    </v-btn>
                  </v-flex>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-card height="400px">
                    <v-container pa-0>
                      <v-layout row wrap>
                        <v-flex
                          v-for="tmpl in templates"
                          :key="tmpl.src"
                          xs4
                          class="img-hover"
                        >
                          <v-card 
                            flat 
                            tile
                            @click="selectedTemplate=tmpl.label" 
                            :class="{'selected-template': selectedTemplate === tmpl.label }">
                            <img                             
                              :src="tmpl.src"
                              width="289px"
                              height="150px"
                            >
                            <img>
                            <span>{{tmpl.label}}</span>
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card>

                  <v-flex class="text-xs-right">
                    <v-btn flat @click="e1 = 1">Previous</v-btn>
                    <v-btn
                      color="primary"
                      @click="showTerminal()"
                    >
                      Next
                  </v-btn>
                  </v-flex>
                  
                </v-stepper-content>

                <v-stepper-content step="3" style="padding-top:0px">
                  <v-card
                    height="500px"
                  >
                    <v-btn color="green" @click="execute()" small style="margin: 5px 0 10px 0">
                      Click here to create the project
                    </v-btn>
                    <div id="terminal-tab" class="terminal"></div>
                  </v-card>
                  <v-flex class="text-xs-right" mt-5>
                    <v-btn flat @click="e1 = 2">Previous</v-btn>
                    <v-btn color="primary" @click="doDone()">
                      Done
                    </v-btn>
                  </v-flex>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import os from 'os'
import * as fit from 'xterm/lib/addons/fit/fit'
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks'
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat'
const pty = require('node-pty')
const Terminal = require('xterm').Terminal
const { dialog } = require('electron').remote
const { ipcRenderer } = require('electron')
const fs = require('fs')
// const path = require('path')

export default {
  name: 'project-page',
  components: {},
  data: () => ({
    e1: 0,
    projectType: 'VUE',
    projectFolder: '',
    projectName: '',
    term: null,
    ptyProcess: null,
    selectedTemplate: 'baseline',
    commandEndText: '',
    templates: [{
      label: 'baseline',
      src: 'https://cdn.vuetifyjs.com/images/layouts/baseline.png'
    },
    {
      label: 'baseline-flipped',
      src: 'https://cdn.vuetifyjs.com/images/layouts/baseline-flipped.png'
    },
    {
      label: 'centered',
      src: 'https://cdn.vuetifyjs.com/images/layouts/centered.png'
    },
    {
      label: 'complex',
      src: 'https://cdn.vuetifyjs.com/images/layouts/complex.png'
    },
    {
      label: 'dark',
      src: 'https://cdn.vuetifyjs.com/images/layouts/dark.png'
    },
    {
      label: 'google-contacts',
      src: 'https://cdn.vuetifyjs.com/images/layouts/google-contacts.png'
    }]
  }),
  methods: {
    doDone () {
      let path = this.projectFolder + '/' + this.projectName
      ipcRenderer.send('project:close', path)
    },
    execute () {
      this.commandEndText = 'Get started with the following'
      this.ptyProcess.write('vue create --preset gitlab:viktorbk/deveditor ' + this.projectName + '\n')
    },
    openFolder () {
      dialog.showOpenDialog(null, {title: 'Open Folder', properties: ['openDirectory']}, (dirPath) => {
        if (dirPath && dirPath.length) {
          this.projectFolder = dirPath[0]
        }
      })
    },
    showTerminal () {
      this.e1 = 3
      setTimeout(this.initTerm, 5)
      // this.initTerm()
    },
    initTerm () {
      // debugger
      const vue = this
      let termTab = document.getElementById('terminal-tab')
      if (window.getComputedStyle(termTab).display === 'none') {
        debugger
        this.initTerm()
        return
      }

      const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
      this.ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 80,
        rows: 20,
        cwd: process.cwd(),
        env: process.env
      })

      Terminal.applyAddon(fit)
      Terminal.applyAddon(webLinks)
      Terminal.applyAddon(winptyCompat)

      this.term = new Terminal({
        cursorBlink: true,
        theme: {
          // background: '#303030',
          foreground: '#5ff967'
        }
      })
      this.term.open(termTab, true)
      this.term.winptyCompatInit()
      this.term.webLinksInit()
      this.term.fit()
      this.term.focus()

      vue.term.on('data', function (data) {
        vue.ptyProcess.write(data)
      })

      this.ptyProcess.on('data', function (data) {
        if (vue.commandEndText && data.indexOf(vue.commandEndText) >= 0) {
          // debugger
        }
        vue.term.write(data)
      })

      this.ptyProcess.write(`cd ${this.projectFolder} && clear\n`)
      this.term.focus()
    }
  },
  computed: {
    selectedTemplateClass: function (lbl) {
      return {
        'selected-template': this.selectedTemplate === lbl
      }
    }
  },
  mounted: function () {
    const homedir = require('os').homedir()
    const prjSettings = homedir + '/.deveditor/project-settings.json'
    fs.stat(prjSettings, (err, stats) => {
      console.log(err)
      let config = fs.readFileSync(prjSettings, 'utf8')
      let obj = JSON.parse(config)
      this.projectFolder = obj.default.projectFolder
    })
  }
}
</script>

<style scoped>
  /* @import '~devextreme/dist/css/dx.common.css';
  @import '~devextreme/dist/css/dx.material.blue.dark.css'; */

  .selected-template {
    opacity: 0.3;
  }
  .img-hover:hover {
    opacity: 0.3;
  }
  .v-content {
    padding: 40px 0px 0px!important;
  }
  .v-card__title {
    font-size: 16px!important;
    padding: 0px!important;
  }
  .v-card {
    background-color: transparent!important;
  }
  .v-messages {
    min-height: 0px!important;
  }
  .v-card {
    padding: 8px!important;
  }
  .v-input--selection-controls {
    margin-top: 8px!important;
    margin-bottom: 0px!important;
  }
  .v-input__slot {
    margin-bottom: 0px!important;
  }
  .terminal {
    width: 100%;
    height: 490px;
  }
</style>
