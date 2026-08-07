export interface GeneralObject {
  [index: string]: string | number | boolean | GeneralObject;
}

export const defaultSettings: GeneralObject = {
  "editor.fontFamily": "JetBrains Mono",
  "editor.fontLigatures": true
};