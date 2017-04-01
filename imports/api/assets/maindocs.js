import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/*
 * 1. We able to get collection module from here.
 */ 
export const Maindocs = new Mongo.Collection('maindocs');

/*
 * 2. Publication of collection will be declared overhere.
 */
if (Meteor.isServer) {
    Meteor.publish('maindocs', function maindocsPublication() {
        return Maindocs.find({});
    });
}

/**Technique is all data will recording based on timeline, so we can find a latest record of each item */
/** การรับ item แต่ละครั้งจะมีข้อมูลเหมือนกัน เช่นผู้ค้า วันส่่ง สถานที่เก็บ ดังนั้นเราจึงควรจะเก็บ ข้อมูล rfid หลายๆชิ้น หรือพูดง่ายๆว่าเก็บเป็นล๊อต
 *  โดยในการนำเข้า จะทำการอ่าน rfid อันต่ออัน แล้วเช็คว่าของที่เข้ามาใน ล๊อตนั้นครบรึยัง
 */
var getModel = function(){
    var maindoc = {
        id:"",
        itemNo:"",
        rfid:{},
        receiveDate: new Date(),
        contractNo: "",
        actionDate: new Date(),
        vendorNo: "",
        departmentNo: "",
        warhouseNo: "",
        zoneNo: "",
        receiveAmount: 0,
        orderAmount: 0,
        balanceAmount : 0,
        remark:"",
        createdAt: new Date(),
    };

    return item;
};

//declare=> var pattern = {"rfid":String, "status": String}; | use=> rfid: [pattern],

var checkModel = function(maindocs){
    check(maindocs, {
        id: String,
        itemNo: String,
        rfid: {name:String},
        receiveDate: Date,
        contractNo: String,
        actionDate: Date,
        vendorNo: String,
        departmentNo: String,
        warhouseNo: String,
        zoneNo: String,
        receiveAmount: Number,
        orderAmount: Number,
        balanceAmount : Number,
        remark: String,
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
    'maindocs.getMaxId' (){
        const data = Maindocs.findOne({}, {sort:{id:-1}});
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
    'maindocs.insert' (maindoc) {
        /*if(checkModel(maindoc)){
            Maindocs.insert(maindoc);
        }*/

        Maindocs.insert(maindoc);
    },

    /* 
    * Method to remove document from collection. [basic operation]
    * @param id of document which need to remove from collection
    */ 
    'maindocs.remove' (id) {
        check(id, String);
        Maindocs.remove({
            id:id,
        });
    },

    /* 
    * Method to remove document from collection. [basic operation]
    * @param id of document which need to remove from collection
    */ 
    'maindocs.removeAll' () {
        Maindocs.remove({});
    },


    /* 
    * Method to check valid document within collection. [basic operation]
    * @param id of document which need to validate
    */
    'maindocs.isValid' (id) {
        check(id, String);
        if(Maindocs.find({id:id}).count() > 0){
            return true;
        }else{
            return false;
        }
    },

    /* 
     * Method to insert document into collection. [basic operation]
     * @param document BSON which need to update collection
     */ 
    'maindocs.updateStatus' (docNo, rfidlist) {
         console.log(docNo);
         Maindocs.update(
            { _id: docNo },
            { $set:
                { rfid: rfidlist,  
                  remark: "done",  
                  actionDate: new Date()}
            }
        );
    },  
    
});
