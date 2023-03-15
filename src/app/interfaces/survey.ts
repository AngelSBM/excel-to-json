export interface Answer {
  fullname: string
  surveyAnswerId: string
}

export interface SurveyQuestion {
  QuestionDescription: string,
  answers: Answer[]
}


export interface Survey {
  idSolictud: number,
  idSurveyRole: number,
  surveyQuestions: SurveyQuestion[]
}
