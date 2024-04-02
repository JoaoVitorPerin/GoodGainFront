import { appVersion } from "src/app/core/ts/version";

export const environment = {
  PRODUCTION: true,
  WEBSOCKET_ATIVO: false,
  TEMPO_ARMAZENAMENTO_SESSAO: 720,
  API_WS: '',
  API_BACK: `https://saojoaoperformanceapi.voaitech.com.br/`,
  API_ONLINE: 'https://saojoaoperformanceapi.voaitech.com.br/',
  VERSAO: appVersion
};
