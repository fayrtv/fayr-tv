export default class PermissionDeviceWatcher {
    private _cleanUpCbs: Array<() => void>;

    constructor() {
        this._cleanUpCbs = [];
    }

    public async start(): Promise<void> {
        await Promise.all([this.observePermissionChange("camera" as PermissionName)]);
    }

    private async observePermissionChange(permissionName: PermissionName): Promise<void> {
        const permissionStatus = await navigator.permissions.query({ name: permissionName });

        const listener = (event: any) => {
            //TODO: Update chime here
        };

        permissionStatus.addEventListener("change", listener);
        this._cleanUpCbs.push(() => permissionStatus.removeEventListener("change", listener));
    }

    public stop(): void {
        this._cleanUpCbs.map((x) => x());
    }
}
