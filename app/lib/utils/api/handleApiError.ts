import { NextRequest, NextResponse } from 'next/server'
import { parseStack } from 'error-stack-parser-es/lite'
import { getErrorMessage } from './getErrorMessage'
import { createLog } from './createLog'

interface ErrorHandlerOptions {
  error: any
  req: NextRequest
  action: string
  statusCode?: number
}

export async function handleApiError({
  error,
  req,
  action,
  statusCode = 500
}: ErrorHandlerOptions): Promise<NextResponse> {
  const errorMessage = getErrorMessage(error) || error.message || 'An unexpected error occurred'

  await createLog('error', `${action} failed: ${error.message}`, {
    errorLocation: parseStack(JSON.stringify(error)),
    errorMessage: error.message,
    errorName: error.name || 'UnknownError',
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    action
  })

  return NextResponse.json(
    {
      message: `${action} failed`,
      error: errorMessage
    },
    { status: statusCode }
  )
}
