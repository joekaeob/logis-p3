import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/*
 * 1. We able to get collection module from here.
 */ 
export const Items = new Mongo.Collection('items');

/*
 * 2. Publication of collection will be declared overhere.
 */
if (Meteor.isServer) {
    Meteor.publish('items', function itemsPublication() {
        return Items.find({});
    });
}


var getModel = function(){
    var item = {
        id:"",
        name:"",
        number:"",
        price:0,
        description:"",
        expire: new Date(),
        createdAt: new Date(),
    };

    return item;
};

var checkModel = function(item){
    check(item, {
        id:String,
        name:String,
        number:String,
        price:Number,
        description:String,
        expire: Date,
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
    'items.getMaxId' (){
        const data = Items.findOne({}, {sort:{id:-1}});
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
    'items.insert' (item) {
        if(checkModel(item)){
            Items.insert(item);
        }
    },

    /* 
    * Method to remove document from collection. [basic operation]
    * @param id of document which need to remove from collection
    */ 
    'items.remove' (id) {
        check(id, String);
        Items.remove({
            id:id,
        });
    },

    /* 
    * Method to check valid document within collection. [basic operation]
    * @param id of document which need to validate
    */
    'items.isValid' (id) {
        check(id, String);
        if(Items.find({id:id}).count() > 0){
            return true;
        }else{
            return false;
        }
    },

    'items.getById' (id) {
        check(id, String);
        return Items.find({id:id});
    },
    
});