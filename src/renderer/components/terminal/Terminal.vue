<template>
  <div id="app">
    <v-app id="inspire" dark>
      <v-toolbar app fixed clipped-left>
        <v-toolbar-title>Terminal</v-toolbar-title>
      </v-toolbar>
      <v-content>
        <v-container fluid fill-height>
          <v-layout>
            <v-flex><div id="terminal-tab" class="terminal"></div></v-flex>   
          </v-layout>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import os from 'os'
import * as fit from 'xterm/lib/addons/fit/fit'
const pty = require('node-pty')
const Terminal = require('xterm').Terminal

export default {
  name: 'terminal-page',
  // components: { xterm },
  data: () => ({
    terminal: null
  }),
  methods: {
    open (link) {
      // this.$electron.shell.openExternal(link)
    }
  },
  mounted: function () {
    debugger
    const vue = this

    const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
    this.ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 10,
      cwd: process.cwd(),
      env: process.env
    })

    this.term = new Terminal({
      cursorBlink: true,
      theme: {
        foreground: '#5ff967'
      }
    })
    this.term.open(document.getElementById('terminal-tab'), true)
    Terminal.applyAddon(fit)
    if (fit) {
      this.term.fit()
    }

    //  this.term._initialized = true
    //  this.term.write('Hello from')

    vue.term.on('data', function (data) {
      vue.ptyProcess.write(data)
    })

    this.ptyProcess.on('data', function (data) {
      vue.term.write(data)
    })
  }
}
</script>

<style scoped>
  .v-content {
    padding: 40px 0px 0px!important;
  }
  .terminal {
    width: 100%;
    height: calc(100% - 100px);
  }
</style>
