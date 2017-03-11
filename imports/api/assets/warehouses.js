import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/*
 * 1. We able to get collection module from here.
 */ 
export const Warehouses = new Mongo.Collection('warehouses');

/*
 * 2. Publication of collection will be declared overhere.
 */
if (Meteor.isServer) {
    Meteor.publish('warehouses', function warehousesPublication() {
        return Warehouses.find({});
    });
}


var getModel = function(){
    var warehouse = {
        id:"",
        name:"",
        description:"",
        //zones:[],
        createdAt: new Date(),
    };

    return warehouse;
};

var checkModel = function(warehouse){
    check(warehouse, {
        id:String,
        name:String,
        description:String,
        //zones:[String],
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
    'warehouses.getMaxId' (){
        const data = Warehouses.findOne({}, {sort:{id:-1}});
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
    'warehouses.insert' (warehouse) {
        if(checkModel(warehouse)){
            Warehouses.insert(warehouse);
        }
    },

    /* 
    * Method to remove document from collection. [basic operation]
    * @param id of document which need to remove from collection
    */ 
    'warehouses.remove' (id) {
        check(id, String);
        Warehouses.remove({
            id:id,
        });
    },

    /*'warehouses.addZone' (id, zoneId) {
        check(id, String);
        Warehouses.update(
            { "id" : id },
            { $push: { zones: zoneId } }
        );
    },
    
    'warehouses.removeZone' (id, zoneId) {
        check(id, String);
        Warehouses.update(
            { "id" : id },
            { $pop: { zones: zoneId } }
        );
    },*/

    /* 
    * Method to check valid document within collection. [basic operation]
    * @param id of document which need to validate
    */
    'warehouses.isValid' (id) {
        check(id, String);
        if(Warehouses.find({id:id}).count() > 0){
            return true;
        }else{
            return false;
        }
    },
    
});