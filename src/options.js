// lodash casing strings
export const CASING_OPTIONS = {
  startCase: 'startCase',
  upperCase: 'upperCase',
  lowerCase: 'lowerCase',
};
CASING_OPTIONS.default = CASING_OPTIONS.startCase;

export const DEFAULT_OPTIONS = {                                          
  includeNumbers: false,                            
  characterLimit: null,
  casing: CASING_OPTIONS.default,
  separator: ' ',
  wordCount: 4,
  useSpaces: true,
};
