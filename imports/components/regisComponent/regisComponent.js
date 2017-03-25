import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './regisComponent.html';

import { Maindocs } from '../../api/assets/maindocs.js';
import { Items } from '../../api/assets/items.js';
import { Vendors } from '../../api/assets/vendors.js';
import { Contracts } from '../../api/assets/contracts.js';
import { Departments } from '../../api/assets/departments.js';
import { Warehouses } from '../../api/assets/warehouses.js';
import { Zones } from '../../api/assets/zones.js';
import { Regisdocs } from '../../api/assets/regisdocs.js';
import { Rfidlist } from '../../api/assets/rfidlist.js';

class RegisComponentCtrl {

    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('maindocs');
        this.subscribe('items');
        this.subscribe('vendors');
        this.subscribe('contracts');
        this.subscribe('departments');
        this.subscribe('warehouses');
        this.subscribe('zones');
        this.subscribe('regisdocs');
        this.subscribe('rfidlist');

        this.helpers({

            items(){
                return Items.find({});
            },

            vendors(){
                return Vendors.find({});
            },

            contracts(){
                return Contracts.find({});
            },

            departments(){
                return Departments.find({});
            },
       
            warehouses(){
                return Warehouses.find({});
            },
            
            zones(){
                return Zones.find({});
            },
            
            regisdocs(){
                /*var tmp = Regisdocs.find({}, {rfid:1, _id:0});*/
                return Regisdocs.find({});
            },

            maindocs(){
                //return Maindocs.find({});
                var doc = Maindocs.find({}, {sort: [ ["createAt", "desc"], ["id", "asc"] ] }).map(
                    function (item) { 
                        return {id: item.id, balance: item.balanceAmount, item: item}; 
                    }
                );

                var tmp = {};
                for(var i in  doc){
                    tmp[doc[i].id] = doc[i].item;
                }

                var result = [];
                for(var i in tmp){
                    result.push(tmp[i]);
                }

                return result;
            }

        });
    }

    addMaindoc(newMaindoc, rfids){
        var tmp = {};

        for(var i=0; i<newMaindoc.receiveAmount; i++)
            tmp[rfids[i].rfid] = "R";
        
        newMaindoc['rfid'] = tmp;
        Session.set("newMaindoc", newMaindoc);
        Session.set("newRfids", tmp);

        Meteor.call('maindocs.getMaxId', function(error, result){
            var maindocs = Session.get("newMaindoc"); 
            
            maindocs.id = (parseInt(result) + 1) + '';
            maindocs.orderAmount = 0;
            maindocs.receiveAmount = Number(maindocs.receiveAmount);
            maindocs.balanceAmount = maindocs.receiveAmount;
            maindocs.receiveDate = new Date(maindocs.receiveDate);
            maindocs.actionDate = maindocs.receiveDate;
            maindocs.createdAt = new Date();
            console.log(maindocs);
            
            //Overide existing session
            Session.set("newMaindoc", maindocs);
            
            /*
            * Execute insert method which will be a different scope again.
            */
            Meteor.call('maindocs.insert', maindocs, function(error, result){
                
                Meteor.call('rfidlist.getMaxId', function(error, result){
                   
                    var newId = parseInt(result);
                    var rfidlist = Session.get("newRfids");
                    var maindocs = Session.get("newMaindoc"); 

                    for(r in rfidlist){
                        
                        var rfid = {};
                        newId++;
                        
                        rfid.id = newId + '';
                        rfid.maindocNo = maindocs.id;
                        rfid.rfid = r;
                        rfid.status = rfidlist[r];
                        rfid.createdAt = new Date();
                        console.log(rfid);
                        
                        Meteor.call('rfidlist.insert', rfid, function(error, result){
                            
                            if(error){
                                console.log(error);
                            }

                            Meteor.call('regisdocs.remove', function(error, result){
                                if(error){
                                    console.log(error);
                                }
                            });

                        });
                    }

                });

            });
    
        });
    }

    removeMaindoc(id) {
        console.log("Remove maindoc id: " + id);
        Meteor.call('maindocs.remove', id);   
    }   

    getItemById(id){
        Meteor.call('items.getById', id);
    }
}   
 
export default angular.module('regisComponent', [
    angularMeteor
]).component('regisComponent', {
    templateUrl: 'imports/components/regisComponent/regisComponent.html',
    controller: ['$scope', RegisComponentCtrl]
}).filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});