type MapEmbedProps = {
  src: string
  title: string
}

export function MapEmbed({ src, title }: MapEmbedProps) {
  if (!src) {
    return (
      <div className="w-full h-56 sm:h-64 bg-warm-surface flex items-center justify-center">
        <p className="text-sm text-warm-muted">Map coming soon</p>
      </div>
    )
  }

  return (
    <div className="w-full h-56 sm:h-64 overflow-hidden">
      <iframe
        src={src}
        title={title}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
