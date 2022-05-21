<template>
    <div>
        <section v-if="mainPage && !myFocusAccountTable && !myUnsubmittedCallsTable">
            <b-card-group deck style="padding: 20px; height:400px">
                <b-card @click="changeView('focusAccounts')" bg-variant="info" text-variant="white" header="My Focus Accounts" class="text-center" >
                    <b-card-text>
                         <p id="nbr" style="line-height: 225px;">
                            {{myFocusAccounts.items.length}}
                         </p>
                         <p v-if="isMyFocusAvailable == false">
                             No focus accounts
                         </p>
                        </b-card-text>
                </b-card>
                <b-card @click="changeView('callsTable')" header="My Unsubmitted Calls" class="text-center" >
                    <b-card-text>
                        <p id="nbr2" style="line-height: 225px;">
                        {{myUnsubmittedCall.items.length}}
                        </p>
                        </b-card-text>
                </b-card>
            </b-card-group>
        </section>
        <section v-else-if="mainPage == false && myFocusAccountTable == true">
            <div  class="scructure-table">
                
                <div style="width:1200px;" class="section-container cell ">
                    <strong @click="changeView()" class="title-text" style="padding: 10px;"> 
                        <img :src="require('../assets/images/arrow_icon.svg')" class="rotate-img"/>&nbsp;
                        My focus accounts and calls</strong>
                    <v-section>
                            <div style=" padding: 10px;">
                                <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label= 'search'
                                    single-line
                                    hide-details>
                                </v-text-field>
                                <div data-app >
                                    <v-data-table
                                        :items="focusAccountsData"
                                        :headers="tableHeadersAccounts" 
                                        :items-per-page="5"
                                        :search="search"
                                        item-key="name"
                                        class="elevation-1"
                                        height="400"
                                        fixed-header
                                        style="padding: 40px;"
                                        >
                                        
                                        <template v-slot:item="row">
                                            <tr @click="smartLink('Account',row.item.Id)">
                                                <td  style="width: 50%;" >
                                                    <!-- <button type="button" class="btn btn-outline-secondary btn-sm" style="border-radius: 4%; box-shadow:0 2px 3px 0 black;"> -->
                                                        {{row.item.Name}}  
                                                    <!-- </button> -->
                                                </td>
                                                <td v-if="row.item.calls">{{row.item.calls.length}}</td>
                                                
                                            </tr>
                                        </template>
                                    
                                    </v-data-table>
                                </div>
                            </div>
                    <v-section>
                </div>
            </div>
        </section>
        <section v-else-if="mainPage == false && myUnsubmittedCallsTable == true">
            <div class="scructure-table" style="padding: 10px;">
                
                <div style="width:1200px;" class="section-container cell ">
                    <strong @click="changeView()" class="title-text" style="padding: 10px;">
                        <img :src="require('../assets/images/arrow_icon.svg')" class="rotate-img"/>&nbsp;
                        My unsubmitted calls</strong>
                    <!-- Call name i.e. call ID in one column & days unsubmitted for each call in another column -->
                    <v-section>
                            <div  style="width: 95%; padding: 10px;">
                                <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label= 'search'
                                    single-line
                                    hide-details>
                                </v-text-field>
                                <div data-app >
                                    <v-data-table
                                        :items="myUnsubmittedCallsData"
                                        :headers="tableHeadersCalls" 
                                        :items-per-page="5"
                                        :search="search"
                                        item-key="name"
                                        class="elevation-1"
                                        height="400"
                                        fixed-header
                                        style="padding: 10px;"
                                        >
                                        
                                        <template v-slot:item="row">
                                            <tr @click="smartLink('Call2_vod__c',row.item.Id)">
                                                <td>
                                                    <!-- <button type="button" class="btn btn-outline-secondary btn-sm" style="border-radius: 4%; box-shadow:0 2px 3px 0 black;"> -->
                                                        {{row.item.Name}}  
                                                    <!-- </button> -->
                                                </td>
                                               <td>
                                                   {{row.item.Id}}
                                                </td>
                                                <td>{{Math.abs(Math.ceil( Math.abs(new Date(row.item.Call_Date_vod__c))/ (1000 * 60 * 60 * 24))- Math.ceil( Math.abs(today)/ (1000 * 60 * 60 * 24))) }} days</td>
                                               
                                                <td>{{row.item.accountName}}</td>
                                            </tr>
                                        </template>
                                    
                                    </v-data-table>
                                </div>
                            </div>
                    <v-section>
                </div>
            </div>
        </section>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { viewRecord } from '../data/myinsights/query';
import 'vuetify/dist/vuetify.min.css'
export default {
    mounted() {
        this.today = new Date()
        this.focusAccountsData = this.myFocusAccounts.items
        this.tableHeadersAccounts = this.myFocusAccounts.headers
         this.tableHeadersCalls = this.myUnsubmittedCall.headers
         this.myUnsubmittedCallsData = this.myUnsubmittedCall.items
       console.log('mounted',this.myFocusAccounts, this.myUnsubmittedCall, this.isMyFocusAvailable)
       this.incEltNbr('nbr',this.myFocusAccounts.items.length)
    //    this.incEltNbr('nbr2',233)//testing large numbers
       this.incEltNbr('nbr2',this.myUnsubmittedCall.items.length)
    },
    computed: {
        ...mapGetters([
           'myFocusAccounts',
           'myUnsubmittedCall',
           'isMyFocusAvailable'
          
        ])},
    data(){
       return {
           today: null,
           filteredTable:[],
           focusAccountsData:[],
           tableHeadersAccounts:[],
           tableHeadersCalls:[],
           myUnsubmittedCallsData:[],
           search:'',
           mainPage:true,
           myFocusAccountTable:false,
           myUnsubmittedCallsTable: false,
        }
    },
    methods:{
         smartLink: viewRecord,
        changeView(pageName){
            if(pageName && pageName == 'focusAccounts'){
                console.log('wtf1', this.mainPage)
                this.mainPage = !this.mainPage
                this.myFocusAccountTable = true
            } else if(pageName && pageName == 'callsTable'){
                 console.log('wtf2', this.mainPage)
                this.myUnsubmittedCallsTable = true
                 this.mainPage = !this.mainPage
            } else if(!pageName){
                 console.log('wtf3', this.mainPage)
                this.mainPage = !this.mainPage
                this.myFocusAccountTable = false
                this.myUnsubmittedCallsTable = false

            }
            console.log('changeView', pageName, this.mainPage, this.myFocusAccountTable, this.myUnsubmittedCallsTable)
        },
          incNbrRec(i, endNbr, elt) {
              if (i <= endNbr) {
                  elt.innerHTML = i;
                  setTimeout(()=> {//Delay a bit before calling the function again.
                  this.incNbrRec(i + 1, endNbr, elt);
                  }, (300/i));
              }
          },
        incEltNbr(id,endNbr) {
            let elt = document.getElementById(id);
            console.log('elt',elt)
            //let endNbr = Number(document.getElementById(id).innerHTML);
                this.incNbrRec(0, endNbr, elt);
            },

    
    }
    
}
</script>
<style scoped>
#nbr{
  font-size:92px;
}
#nbr2{
  font-size:92px;
}
table.v-table tbody td {
    font-size: 28px !important;
}
table.v-table thead th {
      font-size: 30px !important;

 }

 .rotate-img {
    /* transform: scaleY(-1); */
   -webkit-transform: scaleY(-1);
  -moz-transform: scaleY(-1);
  -ms-transform: scaleY(-1);
    
  -webkit-backface-visibility: visible;
  -moz-backface-visibility:    visible;
  -ms-backface-visibility:     visible;
}
.v-input--hide-details>.v-input__control>.v-input__slot {
    width:80%;
}

</style>
