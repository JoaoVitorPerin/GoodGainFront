export interface menuItem {
  id?: number | string,
  icon: string,
  label?: string,
  atalho: string,
  shift?: boolean,
  ctrl?: boolean,
  alt?: boolean,
  tooltip?: string,
  origem: 'prime' | 'material' | null,
  routerLink: string,
  command?(): void
}
