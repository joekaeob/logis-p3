import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/*
 * 1. We able to get collection module from here.
 */ 
export const Rfidlist = new Mongo.Collection('rfidlist');

/*
 * 2. Publication of collection will be declared overhere.
 */
if (Meteor.isServer) {
    Meteor.publish('rfidlist', function rfidlistPublication() {
        return Rfidlist.find({});
    });
}

/**Technique is all data will recording based on timeline, so we can find a latest record of each item */
/** การรับ item แต่ละครั้งจะมีข้อมูลเหมือนกัน เช่นผู้ค้า วันส่่ง สถานที่เก็บ ดังนั้นเราจึงควรจะเก็บ ข้อมูล rfid หลายๆชิ้น หรือพูดง่ายๆว่าเก็บเป็นล๊อต
 *  โดยในการนำเข้า จะทำการอ่าน rfid อันต่ออัน แล้วเช็คว่าของที่เข้ามาใน ล๊อตนั้นครบรึยัง
 */
var getModel = function(){
    var item = {
        id:"",
        maindocNo:"",
        rfid:"",
        status:"",
        createdAt: new Date(),
    };

    return regisdoc;
};

var checkModel = function(item){
    check(item, {
        id:String,
        maindocNo:String,
        rfid:String,
        status:String,
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
    'rfidlist.getMaxId' (){
        const data = Rfidlist.findOne({}, {sort:{id:-1}});
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
    'rfidlist.insert' (rfid) {
        if(checkModel(rfid)){
            Rfidlist.insert(rfid);
        }
    },

    /* 
     * Method to insert document into collection. [basic operation]
     * @param document BSON which need to update collection
     */ 
    'rfidlist.updateStatusIn' (rfidlist) {
        for(r in rfidlist){
            Rfidlist.update(
                {rfid: r},
                { $set:
                    {status:"I"} 
                }
            );
        }
    },

     'rfidlist.updateStatusOut' (rfidlist) {
        for(r in rfidlist){
            Rfidlist.update(
                {rfid: r},
                { $set:
                    {status:"O"} 
                }
            );
        }
    }
});    