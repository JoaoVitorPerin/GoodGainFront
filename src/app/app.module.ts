// Angular
import { NgModule, isDevMode} from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData, CommonModule } from '@angular/common';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Core
import { CacheRequisicoesModule } from './core/interceptors/cache-requisicoes/cache-requisicoes.module';
import { TratamentoErrosModule } from './core/interceptors/tratamento-erros/tratamento-erros.module';
import { InterceptorLoaderModule } from './core/interceptors/loader/loader.module';
import { TokenService } from './core/services/token.service';
import { NotNullModule } from './core/interceptors/not-null/not-null.module';
import { LoaderGeralComponent } from "./shared/components/loader-geral/loader-geral.component";
import { NoFormModule } from "./shared/components/no-form/no-form.module";

//Módulos
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastrModule } from 'src/app/shared/components/toastr/toastr.module';
import { ModalModule } from "./shared/components/modal/modal.module";
import { ModalConfirmacaoModule } from "./shared/components/modal-confirmacao/modal-confirmacao.module";

import { PanelMenuModule } from 'primeng/panelmenu';
import { ServiceWorkerModule } from "@angular/service-worker";
import { AppLayoutModule } from "./core/layout/app.layout.module";

// Import the plugin code
import 'filepond-plugin-image-preview';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.js';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.min.js';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.min.js';
import { registerPlugin } from 'filepond';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

registerLocaleData(localePt, 'pt-br');

@NgModule({
  declarations: [
    AppComponent,
    LoaderGeralComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    AppRoutingModule.routing,
    CacheRequisicoesModule,
    // MultiplasRequisicoesModule,
    TratamentoErrosModule,
    InterceptorLoaderModule,
    NotNullModule,
    PanelMenuModule,
    NoFormModule,
    ToastrModule,
    ModalModule,
    ModalConfirmacaoModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AppLayoutModule,
  ],
  providers: [
    TokenService,
    ConfirmationService,
    MessageService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
