import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/*
 * 1. We able to get collection module from here.
 */ 
export const Regisdocs = new Mongo.Collection('regisdocs');

/*
 * 2. Publication of collection will be declared overhere.
 */
if (Meteor.isServer) {
    Meteor.publish('regisdocs', function regisdocsPublication() {
        return Regisdocs.find({});
    });
}

/**Technique is all data will recording based on timeline, so we can find a latest record of each item */
/** การรับ item แต่ละครั้งจะมีข้อมูลเหมือนกัน เช่นผู้ค้า วันส่่ง สถานที่เก็บ ดังนั้นเราจึงควรจะเก็บ ข้อมูล rfid หลายๆชิ้น หรือพูดง่ายๆว่าเก็บเป็นล๊อต
 *  โดยในการนำเข้า จะทำการอ่าน rfid อันต่ออัน แล้วเช็คว่าของที่เข้ามาใน ล๊อตนั้นครบรึยัง
 */
var getModel = function(){
    var regisdoc = {
        warhouseNo:"",
        rfid:"",
        createdAt: new Date(),
    };

    return regisdoc;
};

var checkModel = function(regisdocs){
    check(regisdocs, {
        warhouseNo: String,
        rfid: String,
        createdAt: Date,
    });

    return true;
}

/*
 * 3. Create all database adapter (method) of this collection here.
 */ 
Meteor.methods({
    /* 
    * Method to remove document from collection. [basic operation]
    * @param id of document which need to remove from collection
    */ 
    'regisdocs.remove' () {
        Regisdocs.remove({});
    }
});    