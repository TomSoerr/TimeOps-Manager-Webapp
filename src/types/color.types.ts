export default interface Color {
  color:
    | 'slate' // default value for "No Project", don't remove
    | 'red'
    | 'amber'
    | 'lime'
    | 'emerald'
    | 'cyan'
    | 'blue'
    | 'violet'
    | 'fuchsia';
}

export interface ColorOption {
  id: number;
  name: Color['color'];
}

export const colors: ColorOption[] = [
  { id: 0, name: 'slate' },
  { id: 1, name: 'red' },
  { id: 2, name: 'amber' },
  { id: 3, name: 'lime' },
  { id: 4, name: 'emerald' },
  { id: 5, name: 'cyan' },
  { id: 6, name: 'blue' },
  { id: 7, name: 'violet' },
  { id: 8, name: 'fuchsia' },
];
