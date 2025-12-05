export type Attachment = {
  url: string
  format: string | null
}

export type ImageResponse = {
  id: number
  fileName: string | null
  description: string | null
  keywords: string[]
  thumbnailUrl: string | null
  attachments: Attachment[]
  createdAt: string
  likesCount: number
  uploaderUsername?: string | null
  uploaderAvatar?: string | null
  likedByCurrentUser?: boolean
}
