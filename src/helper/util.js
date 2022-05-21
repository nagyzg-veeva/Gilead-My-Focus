
/* eslint-disable */
import _ from 'lodash'
const thisYear = new Date().getFullYear()
export const getIds = (data, idField) =>{
let toReturn = []
   data.data.forEach(item =>{
       if(item[idField].value != '' && item[idField].value != null  && !toReturn.includes(item[idField].value) ){
            toReturn.push(item[idField].value)
       }
   })
   return toReturn
  
}

export const objectsFrom = (data, key, value) =>{
    let toReturn = []
       data.forEach(item =>{
                toReturn.push({
                    [item[key].value]: item[value].value
                })
           
       })
       return toReturn
      
    }

export const groupBy = (data, groupByField)=>{
    let result  = _.groupBy(data.data,groupByField)
    return result;
}   

export const groupCallsByAccounts = (calls)=>{
    console.log('calls',calls)
    
  return groupBy(calls, 'Account_vod__c.value');
}

export const accountNameById = (accounts)=>{
    let toReturn = {}
    accounts.data.forEach(item =>{
        toReturn[item.Id.value] = item.Name.value
    }) 
    return toReturn;
}

export const getUnsubmittedCalls = (calls)=>{
    let unsubmittedCalls = {
        data:[],
        fieldLabels:calls.fieldLabels
    }
    calls.data.forEach(item =>{
        if(item.Status_vod__c.value == 'Saved_vod' || 
        item.Status_vod__c.value == 'Planned_vod' ||
        item.Status_vod__c.value == 'Unsubmitted_vod'){
            unsubmittedCalls.data.push(item)
        }
    })
    return unsubmittedCalls;
}

export const viewRecord = (sObject, recordId) => {
    console.log('I am called', sObject, recordId)
    const deferred = $q.defer();
    const smartLink = {
        object: sObject,
        fields: { Id: recordId }
    };
    ds.viewRecord(smartLink).then(resp => {}, err => {
        console.log(err);
    }).catch( err => {
        console.log(err);
    });
    return deferred.promise;
  }

export const addNameToDataWithId  = (dataWithId, dataWithName, idField, newFieldName,isFieldLabelExchange) => {
    console.log('addNameToDataWithId inputs',dataWithId, dataWithName, idField, newFieldName,isFieldLabelExchange )
    if(dataWithId.data.length > 0 && dataWithName.data.length > 0){
        dataWithId.data.forEach(item => {
            dataWithName.data.forEach(name => {
                if(name.DeveloperName && item[idField].value == name.Id.value){
                    item[newFieldName] = {
                        'value':name.DeveloperName.value,
                        'display':name.Name.display
                    }
                } else {
                    if(item[idField].value == name.Id.value) {
                         item[newFieldName] = name.Name
                        console.log('found',newFieldName)
                    }

                }
            })
        })

        if(isFieldLabelExchange){
            exchangeIdFieldWithLabel(dataWithId,idField,newFieldName)
        }
    }
    console.log('addNameToDataWithId',dataWithId)
}


export const getMonthNameInCurrentLanguage = (date,language)=>{
    if(date !=''&& date !=null) {
        return date.toLocaleDateString(language, {  month: 'short' ,year: '2-digit'}); 
    } else return 'N/A';
}

export const areFieldsAvailable = (fieldList, availableFields)=>{
    let fieldsNotAvailable = []
    fieldList.forEach(fieldToCheck =>{
       if(!availableFields.fields.find(field => field.name === fieldToCheck)) {
            fieldsNotAvailable.push(fieldToCheck)
       }
    })
        return fieldsNotAvailable
} 

export const addNumberOfCalls = (accounts, callsgrouped) => {
    console.log('addNumberOfCalls',accounts,callsgrouped)
    // for (let accountId in callsgrouped ){
        accounts.data.forEach(account => {
            console.log('watda',callsgrouped[account.Id.value])
            account['calls'] = {
               'display': callsgrouped[account.Id.value]
            }

        })
    // }
    console.log('addNumberOfCalls2',accounts,callsgrouped)
}



export const createDataForVTable = (data, notNeededFields, additionals, notAvailableFields) => {
    let headers = createVTableHeader(data,notNeededFields,additionals)
    console.log('createDataForVTable',data, notNeededFields, additionals, notAvailableFields )

     let items = []
     data.data.forEach(item => {
         let tempObj = {}
        for(let key in item) {
            console.log('key',key)
            // if(!notNeededFields.includes(key)){
                if(key == 'Call_Date_vod__c'){ //key == 'date' ||
                    let date = new Date(item[key].value)
                     if ( (date.getMonth()+1) < 10 && date.getDate() < 10) {
                         item[key] = {
                             'display': date.getFullYear() +'-0'+  (date.getMonth()+1) + '-0' + date.getDate()}
                     } else if ((date.getMonth()+1) < 10){
                         item[key] = {
                             'display':  date.getFullYear() + '-0' + (date.getMonth()+1) +'-'+ date.getDate()}
                     } else if ((date.getDate()) < 10) {
                         item[key] = {
                         'display': date.getFullYear() +'-'+  (date.getMonth()+1) + '-0' + date.getDate()}
                     } 
                     // tempObj['date'] = item[key].display
                     tempObj[key] = item[key].display
                } else {
                    if(typeof(key[item]) == 'number') {
                     tempObj[key] = Math.round(item[key].display)
                    }
                    // if(item[key].display && item[key].display.includes('vod')){
                    //     item[key].display =  item[key].display.split('_')[0]
                    // }
                    tempObj[key] = item[key].display
     
                }
            // }
            
        }
        items.push(tempObj)
     })
     console.log('items', items, headers)
     
     return {
         headers: headers,
         items: items
     }
 }

 const createVTableHeader = (data,notNeededFields)=>{
    console.log('createVTableHeader',data,notNeededFields)
    // notNeededFields.push('Id' )
    let headers = []
    let infos={
        shippedText: '',
        orderedTExt: ''}
    data.fieldLabels.forEach(label =>{
        console.log('label.name',label.name)
        let tempObj = {}
        
        if(notNeededFields){
            if( !notNeededFields.includes(label.name)){
                tempObj['text'] = label.display
                if(label.name =='Account_vod__c'){
                    tempObj['value'] = 'accountName'
                } else if (label.name == 'Call_Date_vod__c'){
                    tempObj['text'] = 'Days unsubmitted'
                } else {
                    tempObj['value'] = label.name
                }
                // tempObj['value'] = label.name
                headers.push(tempObj)
            } 
   
        
        } else {
            if(label.name =='Account_vod__c'){
                tempObj['value'] = 'accountName'
            } else {
                tempObj['value'] = label.name
            }
            tempObj['text'] = label.display
           
            headers.push(tempObj)
        }
    })
    console.log('headers',headers)
    return headers;
}

export const checkProductLine = (orderLines,veevaMessages)=>{
    let map = {}
    orderLines.data.forEach(item => {
        map[item.zvod_PC_xR1_Group_visibility__c.value] = ''
    })
    if(Object.keys(map).length != 1){
        return {message: veevaMessages.DIFFERENT_ENTITIES,
        color:'red'}
    } else{
        return ''//{message:'ok', color:'green'}
    }
}

export const sumUpListAndCompensation = (orderLines, orderLabel)=>{
    let tempCompensation = 0
    let tempListAmount = 0
    let summary = {}
    orderLines.data.forEach(item=>{
       tempCompensation += item.OM_Compensation_Amount__c.value
       summary['Sum_Compensation_Amount'] =
        {
            value: tempCompensation,
            label: 'Σ ' + item.OM_Compensation_Amount__c.label
        }

        tempListAmount += item.List_Amount_vod__c.value
        summary['Sum_Return_Amount'] =
        {
            value: tempListAmount,
            label: 'Σ ' + item.List_Price_Rule_vod__c.label
        }
    })
    let returnAmount = summary['Sum_Return_Amount'].value //* (-1)
    let percent = (summary['Sum_Compensation_Amount'].value - returnAmount) / returnAmount
    console.log('percent',percent)
    summary['delta'] = {
        value : (Math.abs(percent) > 0) ? (percent * 100)  : 0,
        label: orderLabel[0].display
    }

    // ( OM_Order_Compensation_Amount__c - Order_List_Amount_vod__c ) / Order_List_Amount_vod__c
    
    console.log('summary',summary)
    return summary
}

export const addVeevaMessages = (summary,veevaMessages)=>{
    console.log('wtf',summary,veevaMessages)
    let compensation = {}
    if( Math.abs(summary.delta.value) > 5){
        compensation = {
            number: summary.delta.value.toFixed(2) + '%',
            message: veevaMessages.COMPENSATION_NOT_OK,
            color: 'red'
        }
    } else {
        compensation = {
            number: summary.delta.value.toFixed(2) + '%',
            message: veevaMessages.COMPENSATION_OK,
            color: 'green'
        }
    }
    compensation['sum_compensation'] = summary.Sum_Compensation_Amount.value.toFixed(2)
    compensation['sum_return'] = summary.Sum_Return_Amount.value.toFixed(2)
    console.log('wtf',compensation)
    return compensation
}

export const calculateCompensation = (orderLines)=>{
    orderLines.data.forEach(orderLine =>{
        if(orderLine.OM_Compensation__c.value == 1){
            orderLine.OM_Compensation_Amount__c.value = orderLine.Free_Goods_vod__c.value * orderLine.List_Price_Rule_vod__c.value
        }
       
    })
}


const addProcuctName = (orderL, productNames)=>{
        productNames.forEach(prod =>{
            if(orderL.Product_vod__c.value == prod.Id){
                orderL['productName'] = {
                    value: prod.Name,
                    label: orderL.Product_vod__c.label
                }
            }

        })
}


export const completeVeevaMessages = (userLanguageVMs, englishVMs) =>{
    for (var key in englishVMs) {
        if (!userLanguageVMs[key]) {
            userLanguageVMs[key] = englishVMs[key]
        }
    }
    return userLanguageVMs;
}

export const getInStatementArray = (values) => {
    if(values) {
        return `{'` + values.join(`', '`) + `'}`;
    } else {
        return '{}';
    }
}

export const getInStatement = (values) => {
    if(values) {
        return `{'` + values.toArray().join(`', '`) + `'}`;
    } else {
        return '{}';
    }
}

export const arrayToObject = (array, keyField, valueField) => {
    if(array && array.length > 0) {
        return array.reduce((obj, item) => {
            obj[item[keyField]] = item[valueField];
            return obj;
        }, {});
    } else {
        return {};
    }
};