export interface IInternalRef {
  id: IID;
  title?: ITitle;
  description?: IDescription;
}

type IID = number;
type ITitle = string;
type IDescription = string;
