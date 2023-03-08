import { GeneratorSettings, NexemaSnapshot } from "./models";
import prettier from 'prettier';

export class Generator {
    private _snapshot: NexemaSnapshot;
    private _settings: GeneratorSettings;

    public constructor(snapshot: NexemaSnapshot, settings: GeneratorSettings) {
        this._settings = settings;
        this._snapshot = snapshot;
    }

    public run(): void {
        prettier.format("", {});
    }
}