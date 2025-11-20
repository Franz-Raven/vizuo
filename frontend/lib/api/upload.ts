import { apiRequest } from "@/lib/api";

type FileItem = {
  id: string
  file: File
  previewUrl: string
}
    
export async function uploadImage(userEmail: string, files: FileItem[], attachedFiles: File[], description?: string, keywords: string[] = [], fileName?: string) {
    const formData = new FormData()
    formData.append("email", userEmail)

    if (fileName) formData.append("fileName", fileName)
    if (description) formData.append("description", description)
    if (keywords.length > 0) formData.append("keywords", keywords.join(","))

    files.forEach(fileItem => {
        formData.append("previewFiles", fileItem.file)
    })

    attachedFiles.forEach(file => {
        formData.append("attachmentFiles", file)
    })

    return apiRequest("/images/upload", {
        method: "POST",
        body: formData,
    });
}