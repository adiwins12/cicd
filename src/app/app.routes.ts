import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'card',
    pathMatch: 'full',
  },
  {
    path: 'card',
    loadComponent: () => import('@features/card/card.component').then((m) => m.CardComponent),
    title: 'Wedding Card & Invitation',
  },
  {
    path: 'events',
    loadComponent: () => import('@features/events/events.component').then((m) => m.EventsComponent),
    title: 'Itinerary & Ceremonies',
  },
  {
    path: 'relatives',
    loadComponent: () =>
      import('@features/relatives/relatives.component').then((m) => m.RelativesComponent),
    title: 'Relatives & Guests Directory',
  },
  {
    path: 'rsvp',
    loadComponent: () => import('@features/rsvp/rsvp.component').then((m) => m.RsvpComponent),
    title: 'RSVP & Blessings Wall',
  },
  {
    path: 'admin',
    loadComponent: () => import('@features/admin/admin.component').then((m) => m.AdminComponent),
    title: 'Family Coordinator Dashboard',
  },
  {
    path: '**',
    redirectTo: 'card',
  },
];
