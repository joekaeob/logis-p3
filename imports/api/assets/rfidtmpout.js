import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/*
 * 1. We able to get collection module from here.
 */ 
export const Rfidtmpout = new Mongo.Collection('rfidtmpout');

/*
 * 2. Publication of collection will be declared overhere.
 */
if (Meteor.isServer) {
    Meteor.publish('rfidtmpout', function rfidtmpoutPublication() {
        return Rfidtmpout.find({});
    });
}

/*
 * 3. Create all database adapter (method) of this collection here.
 */ 
Meteor.methods({

    /* 
    * Method to remove document from collection. [basic operation]
    * @param id of document which need to remove from collection
    */ 
    'rfidtmpout.remove' (rfidlist) {
        for(r in rfidlist){ 
            console.log(r);
            Rfidtmpout.remove({
                rfid:r,
            });
        }    
    },

    'rfidtmpout.removeAll' () {
        Rfidtmpout.remove({});
    }

});    
