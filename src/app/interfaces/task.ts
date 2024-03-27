export interface Task {
  id: number
  title: string
  description: string
  priority: number
  status: string
  startTime?: string
  endTime?: string
  numbered: boolean
  items: any[]
}