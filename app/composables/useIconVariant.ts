export function useIconVariant() {
  const isPadded = useState<boolean>('icon-padded', () => false)

  return { isPadded }
}
