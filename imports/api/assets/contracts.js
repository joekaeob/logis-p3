import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/*
 * 1. We able to get collection module from here.
 */ 
export const Contracts = new Mongo.Collection('contracts');

/*
 * 2. Publication of collection will be declared overhere.
 */
if (Meteor.isServer) {
    Meteor.publish('contracts', function contractsPublication() {
        return Contracts.find({});
    });
}


var getModel = function(){
    var contract = {
        id:"",
        name:"",
        description:"",
        createdAt: new Date(),
    };

    return contract;
};

var checkModel = function(contract){
    check(contract, {
        id:String,
        name:String,
        description:String,
        createdAt: Date,
    });

    return true;
}


/*
 * 3. Create all database adapter (method) of this collection here.
 */ 
Meteor.methods({

    /* 
    * Method to find max id from collection. [basic operation]
    */
    'contracts.getMaxId' (){
        const data = Contracts.findOne({}, {sort:{id:-1}});
        if(data == undefined){
            return 0;
        }else{
            return data['id'];
        }
    },  

    /* 
    * Method to insert document into collection. [basic operation]
    * @param document BSON which need to insert into collection
    */ 
    'contracts.insert' (contract) {
        if(checkModel(contract)){
            Contracts.insert(contract);
        }
    },

    /* 
    * Method to remove document from collection. [basic operation]
    * @param id of document which need to remove from collection
    */ 
    'contracts.remove' (id) {
        check(id, String);
        Contracts.remove({
            id:id,
        });
    },

    /* 
    * Method to check valid document within collection. [basic operation]
    * @param id of document which need to validate
    */
    'Contracts.isValid' (id) {
        check(id, String);
        if(Contracts.find({id:id}).count() > 0){
            return true;
        }else{
            return false;
        }
    },
    
});