declare const Kvisaz: IKvisazLibrary;

export interface IKvisazLibrary {
    dialog: IKvisazLibDialog
}

export interface IKvisazLibDialog {
    (options: IKvisazLibDialogOptions): void
}

export interface IKvisazLibDialogOptions {
    addClass?: string;
    title?: string;
    text?:string;
    buttons: Array<IKvisazLibButton>;
}

export interface  IKvisazLibButton {
    text: string;
    callback: Function
}
