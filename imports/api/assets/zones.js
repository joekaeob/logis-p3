import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/*
 * 1. We able to get collection module from here.
 */ 
export const Zones = new Mongo.Collection('zones');

/*
 * 2. Publication of collection will be declared overhere.
 */
if (Meteor.isServer) {
    Meteor.publish('zones', function zonesPublication() {
        return Zones.find({});
    });
}


var getModel = function(){
    var zone = {
        id:"",
        name:"",
        warehouseId:"",
        description:"",
        maxCapacity:0,
        remainCapacity:0,
        createdAt: new Date(),
    };

    return zone;
};

var checkModel = function(zone){
    check(zone, {
        id:String,
        name:String,
        warehouseId:String,
        description:String,
        maxCapacity:Number,
        remainCapacity:Number,
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
    'zones.getMaxId' (){
        const data = Zones.findOne({}, {sort:{id:-1}});
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
    'zones.insert' (zone) {
        if(checkModel(zone)){
            Zones.insert(zone);
        }
    },

    /* 
    * Method to remove document from collection. [basic operation]
    * @param id of document which need to remove from collection
    */ 
    'zones.remove' (id) {
        check(id, String);
        Zones.remove({
            id:id,
        });
    },

    /* 
    * Method to check valid document within collection. [basic operation]
    * @param id of document which need to validate
    */
    'zones.isValid' (id) {
        check(id, String);
        if(Zones.find({id:id}).count() > 0){
            return true;
        }else{
            return false;
        }
    },
    
});