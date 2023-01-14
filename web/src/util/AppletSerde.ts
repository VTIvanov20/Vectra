import { Theme } from 'mafs';

export enum ElementType {

};

export interface AppletPage {

}

export interface Applet {
    theme: Theme;
    pages: AppletPage[];
};