import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrl: './vendas.component.css'
})
export class VendasComponent implements OnInit{
  mocInfosFilial: any = {};
  mocCards: any = [];
  ngOnInit(): void {
      this.mocInfosFilial = {
        cod_filial: 1,
        nome: "Filial Good Gain",
        nm_descritivo: "001 - Filial Good Gain",
        rank_local: 1,
        rank_filial: 1,
        rank_rede: 1,
        nota_nps: 97,
        nota_checklist: 4.26,
        origem: "Cupom Fiscal",
        hora_primeiro: "08:00",
        hora_ultimo: "22:00",
      };

      this.mocCards = [
        {
          id: 1,
          nm_card: "PROJEÇÃO DE FATURAMENTO",
          vlr_principal: 241563944.14,
          is_vlr_principal_perc: false,
          perc_barra: 90.29,
          indicadores: [
            {
              nm_indicador: "Meta",
              vlr_indicador: 261555161.20,
              is_vlr_indicador_perc: false,
            },
            {
              nm_indicador: "Realizado",
              vlr_indicador: 177693961.18,
              is_vlr_indicador_perc: false,
            },
            {
              nm_indicador: "Bruto",
              vlr_indicador: 235327245.65,
              is_vlr_indicador_perc: false,
            },
            {
              nm_indicador: "Mês Ant",
              vlr_indicador: 21.91,
              is_vlr_indicador_perc: true,
              vlr_indicador_secundario: null
            },
            {
              nm_indicador: "Ano Ant",
              vlr_indicador: 6.22,
              is_vlr_indicador_perc: true,
            }
          ]
        },
        {
          id: 2,
          nm_card: "PROJEÇÃO SOBRE META",
          vlr_principal: 92.08,
          is_vlr_principal_perc: true,
          vlr_indicador_secundario: null,
          indicadores: [
            {
              id: 1,
              nm_indicador: "Loja",
              vlr_indicador: 14256426.46,
              is_vlr_indicador_perc: false,
            },

            {
              id: 2,
              nm_indicador: "Digital (Site)",
              vlr_indicador: 2.59,
              is_vlr_indicador_perc: true,
              is_vlr_indicador_secundario: true,
              vlr_indicador_secundario: 387275.45,
              is_vlr_indicador_secundario_perc: false
            },
            {
              id: 3,
              nm_indicador: "Digital (Loja)",
              vlr_indicador: 0.91,
              is_vlr_indicador_perc: true,
              is_vlr_indicador_secundario: true,
              vlr_indicador_secundario: 135875.43,
              is_vlr_indicador_secundario_perc: false
            },
            {
              id: 4,
              nm_indicador: "Super Apps",
              vlr_indicador: 1.16,
              is_vlr_indicador_perc: true,
              is_vlr_indicador_secundario: true,
              vlr_indicador_secundario: 173153.96,
              is_vlr_indicador_secundario_perc: false
            },
            {
              id: 5,
              nm_indicador: "Pedido cancelado",
              vlr_indicador: 0,
              is_vlr_indicador_perc: true,
              is_vlr_indicador_secundario: true,
              vlr_indicador_secundario: 0,
              is_vlr_indicador_secundario_perc: false
            },
          ]
        },
        {
          id: 3,
          nm_card: "LUCRO BRUTO (CMV)",
          vlr_principal: 72.69,
          is_vlr_principal_perc: true,
          vlr_secundario: 135478.98,
          is_vlr_indicador_secundario: true,
          is_vlr_secundario_perc: false,
          perc_barra: 72.69,
          indicadores: [
            {
              id: 1,
              nm_indicador: "Meta",
              vlr_indicador: 575679,
              is_vlr_indicador_perc: false,
              is_vlr_indicador_secundario: true,
              vlr_indicador_secundario: 71.79,
              is_vlr_indicador_secundario_perc: true
            },

            {
              id: 2,
              nm_indicador: "Realizado",
              vlr_indicador: 135478.98,
              is_vlr_indicador_perc: false,
            },
            {
              id: 3,
              nm_indicador: "Rebaixa/PBM",
              vlr_indicador: 8638534.51,
              is_vlr_indicador_perc: false,
            },
            {
              id: 4,
              nm_indicador: "Mês Ant",
              vlr_indicador: 72.83,
              is_vlr_indicador_perc: true,
              vlr_indicador_secundario: 53836883,
              is_vlr_indicador_secundario_perc: false
            },
            {
              id: 5,
              nm_indicador: "Ano Ant",
              vlr_indicador: 69.56,
              is_vlr_indicador_perc: true,
              vlr_indicador_secundario: 69224767,
              is_vlr_indicador_secundario_perc: false
            }
          ]
        },
        {
          id: 4,
          nm_card: "COBERTURA DESCONTO (SALDO)",
          vlr_principal: 0.32,
          is_vlr_principal_perc: true,
          vlr_secundario: 61141,
          is_vlr_indicador_secundario: true,
          is_vlr_secundario_perc: false,
          perc_barra: 72.69,
          indicadores: [
            {
              id: 1,
              nm_indicador: "Meta",
              vlr_indicador: 0.44,
              is_vlr_indicador_secundario: true,
              is_vlr_indicador_perc: true,
              vlr_indicador_secundario: 82223,
              is_vlr_indicador_secundario_perc: false
            },

            {
              id: 2,
              nm_indicador: "Desconto Geral",
              vlr_indicador: 23.13,
              is_vlr_indicador_perc: true,
              is_vlr_indicador_secundario: true,
              vlr_indicador_secundario: 963268.70,
              is_vlr_indicador_secundario_perc: false
            },
            {
              id: 3,
              nm_indicador: "Club Nissei",
              vlr_indicador: 17.33,
              is_vlr_indicador_perc: true,
              is_vlr_indicador_secundario: true,
              vlr_indicador_secundario: 468601.49,
              is_vlr_indicador_secundario_perc: false
            },
            {
              id: 4,
              nm_indicador: "Promo Fornec",
              vlr_indicador: 30.40,
              is_vlr_indicador_perc: true,
              is_vlr_indicador_secundario: true,
              vlr_indicador_secundario: 2801032.04,
              is_vlr_indicador_secundario_perc: false
            },
            {
              id: 5,
              nm_indicador: "Promo Nissei",
              vlr_indicador: 34.05,
              is_vlr_indicador_perc: true,
              is_vlr_indicador_secundario: true,
              vlr_indicador_secundario: 300784.49,
              is_vlr_indicador_secundario_perc: false
            }
          ]
        },
      ];
  }
}
