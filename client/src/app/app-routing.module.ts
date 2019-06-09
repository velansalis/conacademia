import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";

const routes: Routes = [
  { path: "", component: AppComponent, pathMatch: "full" },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule" },
  { path: "profile", loadChildren: "./profile/profile.module#ProfileModule" },
  { path: "**", component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
