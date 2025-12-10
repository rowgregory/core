export default function serializePrisma(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (value instanceof Date) return value.toISOString()
      if (typeof value === 'bigint') return value.toString()
      // Decimal from Prisma comes as object, so convert
      if (value?.toNumber) return value.toNumber()
      return value
    })
  )
}
