import {ProzeListener} from '../../generated/ProzeListener';

export interface ListenerOutput extends ProzeListener {
    getOutput(): string;
}