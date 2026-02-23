import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,               // Importa tu AppModule principal
    ServerModule,            // Habilita renderizado de servidor
    ServerTransferStateModule // <--- ESTO es lo que genera el <script>
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
