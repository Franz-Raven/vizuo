"use client"

type Blob = {
  className?: string
  color?: string 
  sizeVH?: number 
  blurPx?: number 
  opacity?: number 
  falloff?: string 
}

type BackgroundBlobsProps = {
  className?: string
  blobs?: Blob[]
}

export default function BackgroundBlobs({
  className,
  blobs = [
    {
      className: "absolute -top-[35rem] -left-[35rem]",
      color: "var(--color-secondary)",
      sizeVH: 180,
      blurPx: 130,
      opacity: 0.3,
      falloff: "70%",
    },
    {
      className: "absolute -bottom-[47rem] -right-[35rem]",
      color: "var(--color-primary)",
      sizeVH: 250,
      blurPx: 140,
      opacity: 0.3,
      falloff: "70%",
    },
  ],
}: BackgroundBlobsProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}>
      {blobs.map((b, i) => (
        <div
          key={i}
          className={`${b.className ?? ""} rounded-full`}
          style={{
            height: `${b.sizeVH ?? 200}vh`,
            width: `${b.sizeVH ?? 200}vh`,
            filter: `blur(${b.blurPx ?? 120}px)`,
            opacity: b.opacity ?? 0.7,
            backgroundImage: `radial-gradient(
              closest-side,
              color-mix(in oklch, ${b.color ?? "var(--color-primary)"} 100%, white 8%) 0%,
              color-mix(in oklch, ${b.color ?? "var(--color-primary)"} 90%, black 3%) 40%,
              transparent ${b.falloff ?? "70%"}
            )`,
          }}
        />
      ))}
    </div>
  )
}
