import { appVersion } from "src/app/core/ts/version";

export const environment = {
  PRODUCTION: false,
  WEBSOCKET_ATIVO: false,
  TEMPO_ARMAZENAMENTO_SESSAO: 720,
  API_WS: '',
  API_BACK: `http://localhost:8001/`,
  API_ONLINE: 'http://localhost:8001/',
  VERSAO: appVersion
};
