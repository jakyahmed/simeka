import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AbsensiPage } from '../absensi/absensi.page';
import { RekapabsensiPage } from '../rekapabsensi/rekapabsensi.page';
import { CloudPage } from '../cloud/cloud.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'home',
        loadComponent:()=>
        import('../tabhome/tabhome.page').then((m)=>m.TabhomePage),
      },
      {
        path: 'absensi',
        // loadComponent: () => import('../absensi/absensi.page').then( m => m.AbsensiPage)
        component:AbsensiPage
      },
      {
        path: 'rekapabsensi',
        // loadComponent: () => import('../rekapabsensi/rekapabsensi.page').then( m => m.RekapabsensiPage)
        component:RekapabsensiPage
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
      {
        path: 'cloud',
        // loadComponent: () => import('../cloud/cloud.page').then( m => m.CloudPage)
        component:CloudPage
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];
