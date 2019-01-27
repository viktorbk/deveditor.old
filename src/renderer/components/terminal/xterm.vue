<template>
    <div class="card">
        <div class="card-tabs">
            <ul class="tabs tabs-fixed-width">
                <li class="tab"><a class="active" href="#tab1">xTerm</a></li>
            </ul>
        </div>
        <div class="card-content grey lighten-4">
            <div id="tab1">
                <div id="terminal-tab" class="terminal"></div>
            </div>
        </div>
    </div>
</template>

<script>
    // import * as Terminal from 'xterm'
    // import {ipcRenderer} from 'electron'
    import os from 'os'
    const pty = require('node-pty')
    const Terminal = require('xterm').Terminal
    export default {
      data: function () {
        return {
          rendered: false,
          term: null,
          tab: null,
          connected: false,
          stream: null,
          org: null,
          cloudService: null,
          ptyProcess: null,
          instance: {}
        }
      },
      methods: {},
      mounted: function () {
        debugger
        const vue = this

        const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
        this.ptyProcess = pty.spawn(shell, [], {
          name: 'xterm-color',
          cols: 80,
          rows: 30,
          cwd: process.cwd(),
          env: process.env
        })

        this.term = new Terminal({})
        this.term.open(document.getElementById('terminal-tab'), true)
        this.term._initialized = true
        this.term.write('Hello from')

        vue.term.on('data', function (data) {
          debugger
          vue.ptyProcess.write(data)
        })

        this.ptyProcess.on('data', function (data) {
          debugger
          vue.term.write(data)
        })
      }
    }
</script>