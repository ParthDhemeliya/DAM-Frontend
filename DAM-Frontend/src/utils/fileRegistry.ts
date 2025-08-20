// Simple file registry to store File objects separately from Redux state
// since File objects are not serializable

class FileRegistry {
  private files = new Map<string, File>()

  set(id: string, file: File): void {
    this.files.set(id, file)
  }

  get(id: string): File | undefined {
    return this.files.get(id)
  }

  getAll(ids: string[]): File[] {
    return ids.map((id) => this.files.get(id)).filter(Boolean) as File[]
  }

  remove(id: string): void {
    this.files.delete(id)
  }

  clear(): void {
    this.files.clear()
  }
}

export const fileRegistry = new FileRegistry()
