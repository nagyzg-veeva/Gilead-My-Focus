

// var utils = new window.VeevaUtilities();
/* eslint-disable */
import * as ds from '../data/myinsights/query';
import * as util from '../helper/util';

export const loadData = async ({ commit }) => {
   
try {
        let  myFocusAccounts = {}
        let currentUserId = await ds.getCurrent('User', 'Id')
        console.log('user?', currentUserId)
        const TSFavailableFields = await ds.getAvailableFields('TSF_vod__c')
        let isMyFocusAvailable = await TSFavailableFields.fields.find(item => item.name == 'My_Focus_gild__c')
        //test
        // isMyFocusAvailable = undefined
       
        console.log('getTSFavailableFields',TSFavailableFields, isMyFocusAvailable)
        let myCalls = await ds.getCalls(currentUserId.User.Id)

        let territories = await ds.getTerritories();
        let territoryMap = territories.map(territory =>{
            return {
                id: territory.Id.value,
                name: territory.Name.value
            }
        });
        let territoryAssociations = await ds.getuserTerritory2Association(currentUserId.User.Id);
        console.log('territoryAssociations', territoryAssociations)
        let userTerritories = territoryAssociations.map(terr =>{
            return territoryMap.filter(territory => territory.id === terr.Territory2Id.value).map(obj => obj.name).toString();
        });
        console.log('userTerritories', userTerritories)

       if(isMyFocusAvailable){
        let focusAccounts = await  ds.getFocusAccounts(userTerritories)

        myFocusAccounts = await ds.getAccounts(util.getIds(focusAccounts,'Account_vod__c'))
         
          if(myFocusAccounts.data.length > 0){
            let myFocusAccountCalls = await ds.getCalls(currentUserId.User.Id,util.getIds(focusAccounts,'Account_vod__c'))
            let myfocusAccountCallsGrouped =  await util.groupCallsByAccounts(myFocusAccountCalls)
            util.addNumberOfCalls(myFocusAccounts,myfocusAccountCallsGrouped)
            myFocusAccounts.fieldLabels.push({
                'display' :  myCalls.object.singular,
                 'name' :  myCalls.object.singular
                })
            myFocusAccounts = util.createDataForVTable(myFocusAccounts, ['Id'])
            console.log('myFocusAccountCalls',myFocusAccountCalls)
            commit('SET_FOCUS_ACCOUNT_CALLS',myFocusAccountCalls)
        }
        isMyFocusAvailable = true
        //let myCalls = await ds.getCalls(currentUserId)
        
        } else {
            isMyFocusAvailable = false
            myFocusAccounts['items'] = [] 
            //message: 'No focus accounts"
            // veeva messages
        }
       console.log('myFocusAccounts', myFocusAccounts,isMyFocusAvailable )
    commit('SET_MY_FOCUS',myFocusAccounts)
    commit('SET_IS_MYFOCUS_AVAILABLE',isMyFocusAvailable)
    let allAccounts =  await ds.getAccounts()
    
   
    let accountNames = await util.accountNameById(allAccounts)
    myCalls.data.forEach(item=>{
            item['accountName'] = {
                'display': accountNames[item.Account_vod__c.value],
                'name':'accountName'}
    })
    let callsGroupedByAccount = await util.groupCallsByAccounts(myCalls)
    let myUnsubmittedCalls = await util.getUnsubmittedCalls(myCalls)
    myUnsubmittedCalls = await util.createDataForVTable(myUnsubmittedCalls, ['CreatedById','CreatedDate', 'Status_vod__c'])
     console.log('calls',myUnsubmittedCalls, callsGroupedByAccount)
        commit('SET_MY_UNSUBMITTED_CALLS',myUnsubmittedCalls)
        commit('SET_MYCALLS',myCalls)
       
        commit('SET_LOADING',false)
        

        } catch(err){
            console.log('ERROR: ' + err)
            commit('SET_LOADING',false)

        }
}