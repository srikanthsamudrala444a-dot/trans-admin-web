import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // All routes use server-side rendering to avoid prerender issues
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
