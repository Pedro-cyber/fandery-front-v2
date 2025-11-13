import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpintaxService {

  constructor() {}

  /**
   * Reemplaza las variables tipo {{variable}} en la plantilla
   */
  private replaceVariables(text: string, variables: Record<string, string>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
  }

  /**
   * Devuelve un índice determinista basado en una semilla
   */
  private seededIndex(seed: string, length: number): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 1000000007;
    }
    return hash % length;
  }

  /**
   * Resuelve el spintax de forma determinista
   */
  private resolveSpintaxDeterministic(text: string, seed: string): string {
    const regex = /\{([^{}]+?)\}/;
    let match;
    let counter = 0;

    while ((match = regex.exec(text)) !== null) {
      const options = match[1].split('|').map(o => o.trim());
      const index = this.seededIndex(seed + counter, options.length);
      text = text.replace(match[0], options[index]);
      counter++;
    }

    return text;
  }

  /**
   * Genera el texto final (determinista)
   */
  generate(template: string, variables: Record<string, string>, seed: string): string {
    const withVars = this.replaceVariables(template, variables);
    return this.resolveSpintaxDeterministic(withVars, seed);
  }
}
