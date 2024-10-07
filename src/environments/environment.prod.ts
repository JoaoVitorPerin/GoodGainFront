import { appVersion } from "src/app/core/ts/version";

export const environment = {
  PRODUCTION: true,
  WEBSOCKET_ATIVO: false,
  TEMPO_ARMAZENAMENTO_SESSAO: 720,
  API_WS: '',
  API_BACK: `http://123123123:8001/`,
  API_ONLINE: 'http://123123123:8001/',
  VERSAO: appVersion
};
