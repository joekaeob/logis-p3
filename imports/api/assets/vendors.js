import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/*
 * 1. We able to get collection module from here.
 */ 
export const Vendors = new Mongo.Collection('vendors');

/*
 * 2. Publication of collection will be declared overhere.
 */
if (Meteor.isServer) {
    Meteor.publish('vendors', function vendorsPublication() {
        return Vendors.find({});
    });
}


var getModel = function(){
    var vendor = {
        id:"",
        name:"",
        description:"",
        createdAt: new Date(),
    };

    return item;
};

var checkModel = function(vendor){
    check(vendor, {
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
    'vendors.getMaxId' (){
        const data = Vendors.findOne({}, {sort:{id:-1}});
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
    'vendors.insert' (vendor) {
        if(checkModel(vendor)){
            Vendors.insert(vendor);
        }
    },

    /* 
    * Method to remove document from collection. [basic operation]
    * @param id of document which need to remove from collection
    */ 
    'vendors.remove' (id) {
        check(id, String);
        Vendors.remove({
            id:id,
        });
    },

    /* 
    * Method to check valid document within collection. [basic operation]
    * @param id of document which need to validate
    */
    'vendors.isValid' (id) {
        check(id, String);
        if(Vendors.find({id:id}).count() > 0){
            return true;
        }else{
            return false;
        }
    },
    
});