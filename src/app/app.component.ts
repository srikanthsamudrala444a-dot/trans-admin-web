import { Component } from '@angular/core';
import { RouterOutlet, provideRouter, RouterModule } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],  // ⬅️ use `styleUrls`, not `styleUrl`
  providers : [AuthGuard, AuthService]
})
export class AppComponent {
  title = 'admin-web - welcome';
}
