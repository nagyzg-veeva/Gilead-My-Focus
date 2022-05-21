/* eslint-disable */
import '../../assets/js/q';
import '../../assets/js/myinsights_lib';
// import * as util from '../../helper/util';
  // eslint-disable-next-line no-prototype-builtins
    // eslint-disable-next-line no-unused-vars

// promise global variable
const $q = window.Q;
var utils = new window.VeevaUtilities();
var isOnline = utils.isOnline();
console.log('isOnline', isOnline)
// data service global variable
const ds =  window.ds;

export const getFieldLabels = (config)=> {
  return ds.getFieldLabels(config);
}

export const getCurrent = (objectName, fieldName)=> {
    return ds.getDataForCurrentObject(objectName, fieldName);
  }

  export const getAvailableFields = (sObject) => {
    const queryConfig = {
        params: {
            object: sObject
        }
    };
    const deferred = $q.defer();
    ds.getObjectMetadata(queryConfig.params).then(result => {
        // console.log('getObjectMetadata', result)
        deferred.resolve(result.data);
    }, err => {
        console.log(err);
        deferred.resolve(null);
    });
    return deferred.promise;
};

 

export const getFocusAccounts = ()=>{
  const queryConfig = {
    params: {
        object: 'TSF_vod__c',
        fields: ['Account_vod__c','My_Focus_gild__c', 'Id'],
        where: 'My_Focus_gild__c = true'    
    }
};
const deferred = $q.defer();
ds.runQuery(queryConfig.params).then(result => {
    console.log('getFocusAccounts', result)
    deferred.resolve(result)
}, err => {
    console.log(err, err.message);
    deferred.resolve(null);
});
return deferred.promise;
}


export const getAccounts = (accountIds)=>{ //will this report be used my other type of users? Managers etc?
  let whereStatement;
  if(accountIds){
    whereStatement = 'Id IN ' + ds.getInStatement(accountIds)
  } else {
    whereStatement = ''
  }
  const queryConfig = {
    params: {
        object: 'Account',
        fields: ['Name', 'Id'],
        where: whereStatement//'Id IN ' + ds.getInStatement(accountIds)    
    }
};
const deferred = $q.defer();
ds.runQuery(queryConfig.params).then(result => {
    console.log('getAccounts', result)
    deferred.resolve(result)
}, err => {
    console.log(err, err.message);
    deferred.resolve(null);
});
return deferred.promise;
}

export const getCalls = (currentUserId, accountIds)=>{
  console.log('currentUserId',currentUserId)
  let whereStatement;
  if(accountIds){
    whereStatement = 'CreatedById = \''  + currentUserId + '\' AND Account_vod__c IN ' + ds.getInStatement(accountIds)
  } else {
    whereStatement = 'CreatedById = \''  + currentUserId + '\''
  }
  const queryConfig = {
    params: {
        object: 'Call2_vod__c',
        fields: ['Name', 'Status_vod__c', 'Id', 
        'Call_Date_vod__c', 'CreatedById', 'CreatedDate', 'Account_vod__c'],
        where: whereStatement //'CreatedById = \''  + currentUserId + '\''
    }
};
const deferred = $q.defer();
ds.runQuery(queryConfig.params).then(result => {
    console.log('getCalls', result)
    deferred.resolve(result)
}, err => {
    console.log(err, err.message);
    deferred.resolve(null);
});
return deferred.promise;
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



// get veeva messages
// export const getVeevaMessage = (language) => {
//   let veevaMessageList = ['COMPENSATION_NOT_OK','PRODUCTS','TOTAL','ORDERED','ALL',
//   'DIFFERENT_ENTITIES','COMPENSATION_WITH_QUANTITY','COMPENSATION_OK']
//   let categoryList = ['Common','InventoryOrder']
  
//   console.log('language', language) 

//   let whereOffLine =  'Language_vod__c = \'' + language + '\'' +
//   ' AND Category_vod__c IN (' + util.getInStatementArray(categoryList) + ')' +
//   ' AND Name IN (' + util.getInStatementArray(veevaMessageList) + ')'

//   let whereOnline =  'Language_vod__c = \'' + language + '\'' + 
//   ' AND Category_vod__c IN ' + ds.getInStatement(categoryList) +
//   ' AND Name IN ' + ds.getInStatement(veevaMessageList)  
                                                                   

//   const queryConfig = {
//       params: {
//           object: 'Message_vod__c',
//           fields: ['Name', 'Text_vod__c','Category_vod__c'],
//           where: isOnline ? whereOnline : whereOffLine          
//       }
//   };
//   const deferred = $q.defer();
//   ds.queryRecord(queryConfig.params).then(result => {
//       console.log('getVeevaMessages', result)
//       deferred.resolve(util.arrayToObject(result.Message_vod__c, 'Name', 'Text_vod__c'));
//   }, err => {
//       console.log(err, err.message);
//       deferred.resolve(null);
//   });
//   return deferred.promise;
// };
