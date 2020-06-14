declare const Kvisaz: IKvisazLibrary;

export interface IKvisazLibrary {
    dialog: IKvisazLibDialog;
    window: IKvisazLibDialog;
    close: IKvisazDialogCloser;
    getWrapperSelector: IKvisazDialogGetter;
}

export interface IKvisazLibDialog {
    (options: IKvisazLibDialogOptions): void
}

interface IKvisazDialogCloser {
    (wrapper: HTMLElement): void;
}

interface IKvisazDialogGetter {
    (): string;
}

export interface IKvisazLibDialogOptions {
    addClass?: string;
    title?: string;
    text?: string;
    html?: string;
    onClick?: Function;
    buttons: Array<IKvisazLibButton>;
}

export interface IKvisazLibButton {
    text: string;
    callback: Function;
    warning?: string; // текст предупреждения
}
