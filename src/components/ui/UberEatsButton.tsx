"use client"

type Props = {
  webUrl: string
  className?: string
  children: React.ReactNode
}

/**
 * On mobile: navigates in the same tab so the OS can intercept via
 * Universal Links (iOS) / App Links (Android) and open the Uber Eats app
 * if installed. Falls back to the web URL when the app isn't installed.
 * On desktop: opens in a new tab as usual.
 */
export function UberEatsButton({ webUrl, className, children }: Props) {
  function handleClick() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      window.location.href = webUrl
    } else {
      window.open(webUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
