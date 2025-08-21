import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { RouterModule } from '@angular/router'; 
import { AppComponent } from './app/app.component';


@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  imports: [RouterModule]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient()
    
  ]
}).catch(err => console.error(err));