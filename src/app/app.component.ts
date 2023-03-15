import { Component } from '@angular/core';
import * as XLSX from "xlsx";
import { Survey } from './interfaces/survey';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'excel';

  public data: Object[] = []
  public formattedRows: any[] = []
  public formattedArray: any[] = []

  public obj: object = new Object()


  public tableHeads: string[] = []

  cahngeEvent(event: any){
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws) as Object[]; // to get 2d array pass 2nd parameter as object {header: 1}
      console.log(data); // Data will be logged in array format containing objects
      this.buildTable(data)
      this.data = data
    };



  }

  async buildTable(data: Object[]){


    this.tableHeads = Object.keys(data[this.indexOfRowWithMoreCells(data)])


    let formattedData: any[] = []

    let formattedArray: any[] = []

    data.forEach(row => {

      let object: any = {}

      let arr: any[] = []


      for (let i = 0; i < Object.keys(row).length; i++) {
        const element = Object.values(row)[i];
        object[i] = element
        arr.push(element)

      }

      formattedData.push(object)
      formattedArray.push(arr)


    })


    this.formattedRows = formattedData
    this.formattedArray = formattedArray
    console.log(formattedArray);


  }

  indexOfRowWithMoreCells(data: Object[]){

    let index = 0
    let currentRowWithMoreCells = 0

    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      if(Object.keys(element).length > currentRowWithMoreCells){
        currentRowWithMoreCells = Object.keys(element).length
        index = i
      }
    }

    // console.log(Object.keys(data[index]));

    return index


  }


  send(){

    let body: Survey = {
      idSolictud: 12,
      idSurveyRole: 1,
      surveyQuestions: []
    }

    let questions: any[] = this.tableHeads.map(q => { return { description: q, answers: [] } })
    let newQuestions: any[] = []

    this.tableHeads.forEach((questionDescription: any) => {

      let answers: any[] = []

      this.data.forEach((result:any) => {
        const surveyAnswerId = this.pipeEntityDesciptionToId(result[questionDescription])
        const fullname = Object.values(result)[0]
        answers.push({
          surveyAnswerId,
          fullname
        })
      })

      newQuestions.push({
        description: questionDescription,
        answers
      })

    })

    newQuestions.shift()

    body.surveyQuestions = newQuestions
    console.log(body);


  }


  pipeEntityDesciptionToId(description: any): number{
    let entityId = 0
    // console.log('DESCRIOPTION', description);

    switch (description) {
      case 'De acuerdo':
        entityId = 1
        break;
      case 'Muy de acuerdo':
        entityId = 2
        break;
      case 'En desacuerdo':
          entityId = 3
        break;
      case 'Muy en desacuerdo':
        entityId = 4
        break;
      case 'Ni en desacuerdo ni de acuerdo':
        entityId = 5
        break;
      default:
        break;
    }


    return entityId

  }

}
