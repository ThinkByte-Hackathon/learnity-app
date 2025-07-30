export interface ControllerAttributes {
    handler: Function;
    auth: boolean;
}

export interface ControllerGroup {
    [key: string]: ControllerAttributes | ControllerGroup; // iç içe olan yönlendirmeler için
}
