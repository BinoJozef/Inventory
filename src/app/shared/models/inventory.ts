
export interface SaveOrder { 
    masterId:number;
    customerCode:string;
    companyId:number;
    categoryId:number;
    subCategoryId:number;
    userId:number;
    statusId:number;
    note:string;
    itemCode:string;
    sequenceNumber:number; 
    flowTypeId:number; 
}

export interface Order{
    masterId:number;
    customerCode:string;
    companyId:number;
    categoryId:number;
    subCategoryId:number;
    sequenceNumber:number;//max al
    notes:Notes[]
}
export interface Notes{
    professionId:number,
    note:string,
    userId:number,
    userName?:string,
    noteBy?:string
}

export interface Report{
    company:string,
    customerBrunch:string,
    customerName:string,
    customerType:string,
    customerCode:string,
    invCategory:string,
    invSubCategory:string,
    invCode:string
}

export interface Items{
    companyId:number,
    company:string,
    code:string,
    name:string,
    category:string,
    subCategory:string,
    status:string,
    customerName:string
}

export interface UpdateItems{
   companyId:number,
   code:string,
   categoryId:number,
   subCategoryId:number,
   statusId:number
}

export interface DialogItems{
    categoryId:number,
    subCategoryId:number,
    statusId:number
}

export interface Appeal{
    masterId:number,
    customerCode:string,
    customerName:string,
    appealType:string,
    category:string,
    statusId:number,
    status:string,
    createdDate:string,
    userId:number,
    groupName?:string,
    appealLines:AppealLine[]
}
export interface AppealLine{
    sequenceNumber:number,
    statusId:number,
    executedDate:string,
    userId:number
}

export interface SaveTransfer{
    masterId:number,
    customerCode:string,
    oldCustomerCode:string,
    flowTypeId:number,
    userId:number,
    statusId:number,
    itemCode:string,
    sequenceNumber:number,
    companyId:number,
    note:'',
    reasonId:number
}

export interface Transfer{
    masterId:number;
    customerCode:string;
    oldCustomerCode:string;
    companyId:number;
    flowTypeId:number;
    reasonId:number;
    itemCode:string;
    sequenceNumber:number;//max al
    notes:Notes[]
}

export interface TimeLine{
    date:string,
    status:string,
    class:string
}

export interface NeededApprove{
    masterId:number,
    appealType:string,
    appealTypeId:string,
    createdDate:string
}

export interface PrintResource{
    customerCode:string,
    customerName:string,
    itemCode:string,
    itemName:string,
    companyName:string      
}
