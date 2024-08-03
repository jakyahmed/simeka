import { PrakerinHomePage } from './prakerin.home/prakerin.home.page';
import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./prakerin.home/prakerin.home.page').then((m) => m.PrakerinHomePage),
    },
    {
        path: 'jurnal',
        loadComponent: () => import('./jurnal/jurnal.page').then((m) => m.JurnalPage),
    },
    {
        path: 'presensi',
        loadComponent: () => import('./rekap.presensi/rekap.presensi.page').then((m) => m.RekapPresensiPage)
    },
    {
        path: 'detailpresensi',
        loadComponent: () => import('./detail.presensi/detail.presensi.page').then((m) => m.DetailPresensiPage)
    },
    {
        path: 'logs',
        loadComponent: () => import('./logs.siswa/logs.siswa.page').then((m) => m.LogsSiswaPage)
    },
    {
        path: 'reset',
        loadComponent: () => import('./reset.siswa/reset.siswa.page').then((m) => m.ResetSiswaPage)
    },
    {
        path: '',
        redirectTo: '/tabs/prakerin/home',
        pathMatch: 'full'
    },
    {
        path: 'jurnalguru',
        loadComponent: () => import('./jurnal.guru/jurnal.guru.page').then((m) => m.JurnalGuruPage)
    },
    {
        path: 'detailjurnal',
        loadComponent: () => import('./detail.jurnal/detail.jurnal.page').then(m => m.DetailJurnalPage)
    }





];