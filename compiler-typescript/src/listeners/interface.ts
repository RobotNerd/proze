import {ProzeListener} from '../../generated/ProzeListener';

export interface ListenerOutput extends ProzeListener {
    get_output(): string;
}