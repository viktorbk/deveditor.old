import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/landing-page/LandingPage').default
    },
    {
      path: '/terminal',
      name: 'terminal-page',
      component: require('@/components/terminal/Terminal').default
    },
    {
      path: '/project',
      name: 'project-page',
      component: require('@/components/project/Project').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
