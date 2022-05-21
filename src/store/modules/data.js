
/* eslint-disable */
let state = {
    isLoading: true,
    veevaMessages: {},
    myFocusAccounts: {},
    myUnsubmittedCall:[],
    isMyFocusAvailable:''

}

const mutations = {
    'SET_LOADING': (state, isLoading) => {
        state.isLoading = isLoading;
    },
    'SET_MY_FOCUS':(state,myFocusAccounts) => {
        state.myFocusAccounts = myFocusAccounts
    },
    'SET_VEEVA_MESSAGES': (state,veevaMessages) =>{
        state.veevaMessages = veevaMessages
    },
    'SET_MY_UNSUBMITTED_CALLS': (state,myUnsubmittedCall) =>{
        state.myUnsubmittedCall = myUnsubmittedCall
    },
   'SET_IS_MYFOCUS_AVAILABLE': (state,isMyFocusAvailable) =>{
        state.isMyFocusAvailable = isMyFocusAvailable
   }

}



const actions = {
    setLoading({ commit }, isLoading) {
        commit('SET_LOADING', isLoading);
    }
}


const getters = {
   
    isLoading: state => {
        return state.isLoading
    },

    veevaMessages: state =>{
        return state.veevaMessages
    },
    myFocusAccounts: state => {
        return state.myFocusAccounts
    },
    myUnsubmittedCall: state => {
        return state.myUnsubmittedCall
    },
    isMyFocusAvailable: state => {
        return state.isMyFocusAvailable
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}