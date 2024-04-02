import { appVersion } from "src/app/core/ts/version";

export const environment = {
  PRODUCTION: false,
  WEBSOCKET_ATIVO: false,
  TEMPO_ARMAZENAMENTO_SESSAO: 720,
  API_WS: '',
  API_BACK: `http://localhost2.com.br:8000/`,
  API_ONLINE: 'https://vendamaisapi.nisseilabs.com.br/',
  VERSAO: appVersion
};
