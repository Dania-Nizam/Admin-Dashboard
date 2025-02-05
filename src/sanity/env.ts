export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-03'

export const dataset = assertValue(
  "production",
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const projectId = assertValue(
 "r78by8w6" ,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)

export const token = assertValue(
  "skHWxpx47JAcBtgKFHcVmKOQ430D2fgG7SRRW0tSYUbFyc7A3fVwKBk9FRvtCAGCIntDV9KPtQ3D5tHgvmNRmJ2NTW14N06021uMcP0L0WX4KnhZTTCjpcLX9UPgmF8JjauTpd2HkeQSUDmJSsgetYNxTt4eJFkd0g6kVQdhDYmcRaqZLO26",
  'Missing environment variable: "skHWxpx47JAcBtgKFHcVmKOQ430D2fgG7SRRW0tSYUbFyc7A3fVwKBk9FRvtCAGCIntDV9KPtQ3D5tHgvmNRmJ2NTW14N06021uMcP0L0WX4KnhZTTCjpcLX9UPgmF8JjauTpd2HkeQSUDmJSsgetYNxTt4eJFkd0g6kVQdhDYmcRaqZLO26"'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
