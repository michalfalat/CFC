export class PercentageEntryData {

  public headerText: string;
  public inputText: string;
  public typeText: string;
  public percentageText: string;
  public possibleData = [];
  public possibleTypes = [];
  public maxPercentage: number;
  public entryData: PercentageSaveData;
  public isEdit: boolean;
}

export class PercentageSaveData {
  public isEdit;
  public selectedInput;
  public selectedType;
  public percentage;
}
