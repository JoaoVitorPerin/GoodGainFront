import { TemplateRef } from '@angular/core';

export interface modalBotoes {
  color?: string, //primary | success | secondary | warning | danger | info | success | help
  icon?: string,
  class?: string,
  manterModalAberta?: boolean,
  atalho?: string | Array<string>,
  text?: boolean,
  outlined?: boolean,
  size?: string,
  label: string,
  onClick: () => void
}

export interface modalConfiguracoes {
  isArrastar?: boolean,
  isRedimensionar?: boolean,
  isMaximizar?: boolean,
  isCabecalho?: boolean,
  larguraDesktop?: number, //em vw
  larguraMobile?: number, //em vw
}

export interface modal {
  titulo: string,
  template: TemplateRef<any>,
  botoes: Array<modalBotoes>,
  config?: modalConfiguracoes
}

export interface modalOpcoes {
  titulo: string;
  template: TemplateRef<any>;
  isArrastar: boolean;
  isRedimensionar: boolean;
  isMaximizar: boolean;
  isCabecalho: boolean;
  isFechar: boolean;
  larguraDesktop: string;
  larguraMobile: string;
  botoes: Array<modalBotoes>;
  visible: boolean;
  hash: string;
}



