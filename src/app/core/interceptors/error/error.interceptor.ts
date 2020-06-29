import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {

    console.log("\n\n\nError Handler", error);

    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    if (!/tamanhoFonte/.test(error.message)) {
      console.error(error);
    }
    if (chunkFailedMessage.test(error.message)) {
      if (confirm(`Nova versão encontrada!\r\nClique em 'OK' para atualizar`)) {
        window.location.reload();
      }
    }
  }

}
