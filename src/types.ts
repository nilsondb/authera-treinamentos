export type Student = {
  name: string
  email: string
  enrolledAt: string
}

export type Lesson = {
  id: number
  title: string
  hours: number
}

export type Discipline = {
  id: number
  title: string
  lessons: Lesson[]
}

export type Course = {
  id: string
  title: string
  shortTitle: string
  hours: number
  disciplines: Discipline[]
}
