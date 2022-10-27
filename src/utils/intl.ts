export const formatList = (values: string[]) =>
  new Intl.ListFormat('pt-BR').format(values)
