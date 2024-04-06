import { appVersion } from "src/app/core/ts/version";

export const environment = {
  PRODUCTION: false,
  WEBSOCKET_ATIVO: false,
  TEMPO_ARMAZENAMENTO_SESSAO: 720,
  API_WS: '',
  API_BACK: `https://goodgainapi.com.br/`,
  API_ONLINE: 'https://goodgainapi.com.br/',
  VERSAO: appVersion
};
