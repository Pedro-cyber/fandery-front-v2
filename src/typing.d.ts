// Declaraciones para Bootstrap JS
declare module 'bootstrap' {
  export class Modal {
    constructor(element: HTMLElement, options?: any);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
  }

  export class Tooltip {
    constructor(element: HTMLElement, options?: any);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
  }

  export class Popover {
    constructor(element: HTMLElement, options?: any);
    show(): void;
    hide(): void;
    toggle(): void;
    dispose(): void;
  }
}
