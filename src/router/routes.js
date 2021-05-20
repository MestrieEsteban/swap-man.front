
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: '', name:'Home', component: () => import('pages/Index') }
    ]
  },
  {
    path: '/games',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: 'games', name:'Games', component: () => import('pages/games/maps') }
    ]
  },

  {
    path: '/rooms',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: 'join/:name', name:'JoinRoom', component: () => import('pages/rooms/joinRoom') },
      { path: 'list/:id', name:'ListRoom', component: () => import('pages/rooms/listRoom') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
