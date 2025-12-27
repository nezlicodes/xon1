/**
 * Utility to defer non-critical JavaScript execution
 */
export const deferExecution = (callback: () => void, delay: number = 0) => {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(callback, { timeout: delay })
  } else {
    setTimeout(callback, delay)
  }
}

export const deferScript = (src: string) => {
  if (process.client) {
    deferExecution(() => {
      const script = document.createElement('script')
      script.src = src
      script.defer = true
      document.body.appendChild(script)
    })
  }
}