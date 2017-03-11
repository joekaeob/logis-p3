import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/*
 * 1. We able to get collection module from here.
 */ 
export const Departments = new Mongo.Collection('departments');

/*
 * 2. Publication of collection will be declared overhere.
 */
if (Meteor.isServer) {
    Meteor.publish('departments', function departmentsPublication() {
        return Departments.find({});
    });
}


var getModel = function(){
    var department = {
        id:"",
        name:"",
        description:"",
        createdAt: new Date(),
    };

    return item;
};

var checkModel = function(department){
    check(department, {
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
    'departments.getMaxId' (){
        const data = Departments.findOne({}, {sort:{id:-1}});
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
    'departments.insert' (department) {
        if(checkModel(department)){
            Departments.insert(department);
        }
    },

    /* 
    * Method to remove document from collection. [basic operation]
    * @param id of document which need to remove from collection
    */ 
    'departments.remove' (id) {
        check(id, String);
        Departments.remove({
            id:id,
        });
    },

    /* 
    * Method to check valid document within collection. [basic operation]
    * @param id of document which need to validate
    */
    'departments.isValid' (id) {
        check(id, String);
        if(Departments.find({id:id}).count() > 0){
            return true;
        }else{
            return false;
        }
    },
    
});