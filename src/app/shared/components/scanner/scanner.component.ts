import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [],
  templateUrl: './scanner.component.html',
  styleUrl: './scanner.component.css'
})
export class ScannerComponent {

  @Input({required: true}) model: any;

  @Output() modelChange = new EventEmitter();

  textoScaneado: string = '';

  timeoutId: any

  constructor(){}

  /**
   * Manipula eventos de teclado para capturar dados de um scanner de código de barras.
   * @param {KeyboardEvent} event - O evento de teclado capturado.
   * @HostListener('document:keydown', ['$event'])
  */
  @HostListener('document:keydown', ['$event'])
  handleScanner(event: KeyboardEvent) {

    /**
    * Expressão regular para validar caracteres válidos para códigos de barras EAN. Apenas números e 'L' que está presenta em medicamentos
    * @type {RegExp}
    */
    const regexEan = /^[0-9Ll]$/i

    /**
    * Verifica se o caractere do evento é válido para um código de barras com base no regex acima.
    * @type {boolean}
    */
    const charValidoParaCodigoDeBarras =  (event.key.length === 1 && regexEan.test(event.key)) || event.key === 'Enter';

    /**
    * Sai da função caso o caracter esteja fora do padrão de um EAN
    */
    if (!charValidoParaCodigoDeBarras)
      return


    if (event.key != 'Enter') {
      /**
      * Adiciona o caractere ao texto scaneado se for dirente de Enter.
      */
      this.textoScaneado += event.key;

      /**
      * Adição de timeout para chamar a função que irá emitir o EAN bipado e limpar o conteúdo após essa ação
      */
      clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {
        this.handleTextoEscaneado();
      }, 100);

    } else {

      /**
      * Após bipar um produto, o leitor gera eventos para cada caracter e ao final é automaticamente gerado o evento do Enter. Quando isso ocorre, o model é atualizado, um evento de uma Output property é disparado e em seguida o model é resetado.
      * Se o Enter for pressionado e o texto bipado estiver vazio, indica que o Enter partiu do teclado e não do scanner. Devido a isso, foi adicionado um return
      */

      if(!this.textoScaneado)
        return

      event.preventDefault()
      event.stopImmediatePropagation()

      this.handleTextoEscaneado()
    }
  }

  handleTextoEscaneado(): void {
    this.modelHandler(this.textoScaneado);
    this.textoScaneado = '';
  }

  modelHandler(val: string): void {
    /*
    * Regex para validar se a string digitada é um EAN
    */
    const isEan = /^[a-zA-Z0-9][0-9]{7,}$/;

    /*
    * Valida se o valor recebido nesse handler está no padrão de um EAN. Se estiver, emite o evento
    */
    if(isEan.test(val)){
      this.model = val
      this.modelChange.emit(this.model)
    }
  }

}
