import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './gateIn.html';

import { Maindocs } from '../../api/assets/maindocs.js';
import { Rfidlist } from '../../api/assets/rfidlist.js';
import { Rfidtmp } from '../../api/assets/rfidtmp.js';

class GateIntCtrl {

    constructor($scope) {
        $scope.maindocsObj = {};
        $scope.viewModel(this);
        this.subscribe('maindocs');
        this.subscribe('rfidlist');
        this.subscribe('rfidtmp');
        Meteor.call('rfidtmp.removeAll');

        this.helpers({
            
            maindocs(){
                return Maindocs.find({});
            },

            rfidlist(){
                return Rfidlist.find({});
            },
            
            matchresult(){

                var maindocNum = {};

                /** ทุก map ทำให้ ิbig O เกิดปัญหาขึ้นเพราะต้องทำ double processes ในการดึงข้อมูลจาก array ใหญ่ */
                var rfidNumbersTmp = Rfidtmp.find({}).map(
                    function (item) { 
                        return {_id: item._id, rfid: item.rfid}; 
                    }
                );

                var rfidNumbers = [];
                for(var i in rfidNumbersTmp){
                    rfidNumbers.push(rfidNumbersTmp[i]['rfid']);
                }

                                
                console.log("------Maindoc 1------");
                console.log(rfidNumbers);
                console.log("------Maindoc 2------");


                /**
                 * Find match rfid from maindocs collection
                 */
                var rfidList = Rfidlist.find({rfid:{$in:rfidNumbers}}).map(
                    function (item) { 
                        /** มีปัญหาสำหรับ id ที่ซ้ำกันอยู่ */
                        return {_id: item._id, rfid: item.rfid, maindocNo: item.maindocNo, status: item.status}; 
                    }
                );

                //var rfidList2 = Rfidlist.find({rfid:{$in:rfidNumbers}});

                /**
                 * Find invalid status of rfid from retreive collection
                 */
                var matchList = [];
                var rfidMatchList = [];
                var rfidInvalidList = [];
                for(r in rfidList){
                    
                    matchList.push(rfidList[r].rfid);
                    
                    if(rfidList[r].status === "R"){
                        rfidMatchList.push(rfidList[r]);

                        /** Check duplicate record in scope objs */
                        if($scope.maindocsObj[rfidList[r].maindocNo]){
                         
                            if($scope.maindocsObj[rfidList[r].maindocNo]["count"][rfidList[r].rfid] === "R"){
                                $scope.maindocsObj[rfidList[r].maindocNo]["count"][rfidList[r].rfid] = "I";
                                $scope.maindocsObj[rfidList[r].maindocNo]["token"]++;
                            }else{
                                /**
                                 * ไม่รวมเคสที่ RFID ที่ทำการลงทะเบียนถูกต้องแต่มีรหัสซ้ำผ่านเข้า gate
                                 * เพราะฉนั้นระบบไม่สามารถดัก RFID ที่มี status R แต่มีรหัสซ้ำได้ ถ้าจะดักให้ดักที่ else ตรงนี้
                                 */
                            }

                        /** Insert new document record into scope obj */
                        }else{
                            var docObj = Maindocs.find({id:rfidList[r].maindocNo},  {sort: [ ["createAt", "desc"], ["id", "asc"] ] }).map(
                                function (item) { 
                                    return {_id:item._id, id:item.itemNo, max: Object.keys(item.rfid).length, count:item.rfid ,token: 0};
                            });

                            docObj[docObj.length-1]['count'][rfidList[r].rfid] = "I";
                            docObj[docObj.length-1]['token']++;

                            console.log(docObj);
                            $scope.maindocsObj[rfidList[r].maindocNo] = docObj[docObj.length-1];
                        }

                        if($scope.maindocsObj[rfidList[r].maindocNo]["token"] == $scope.maindocsObj[rfidList[r].maindocNo]["max"]){
                            
                            Session.set("rfidCount", $scope.maindocsObj[rfidList[r].maindocNo]["count"]);

                            /** Update maindocs to be ready for in warehouse state */
                            Meteor.call('maindocs.updateStatus', $scope.maindocsObj[rfidList[r].maindocNo]["_id"], $scope.maindocsObj[rfidList[r].maindocNo]["count"], function(error, result){
                                
                                /** Update rfidlist to be ready for in warehouse state */
                                Meteor.call('rfidlist.updateStatusIn', Session.get("rfidCount"), function(error, result){

                                    /** Update rfidlist to be ready for in warehouse state */
                                    Meteor.call('rfidtmp.remove', Session.get("rfidCount"), function(error, result){
                                        
                                    });
                                });
                                
                            });
                            
                            console.log("hae");
                        }

                    }else{
                        rfidInvalidList.push(rfidList[r]);
                    }
                    
                }

                /**
                 * Find rfid which not existing in the system
                 */
                var rfidNotMatchList = Rfidtmp.find({rfid:{$nin:matchList}}).map(
                    function (item) {
                        return {rfid: item.rfid, createAt: item.createAt}; 
                    }
                );
                return {"success":rfidMatchList, "invalid":rfidInvalidList, "fail":rfidNotMatchList};
            },
        });
    } 

    removeRfidTmpAll() {
        console.log("Remove all rfidtmp");
        Meteor.call('rfidtmp.removeAll');   
    }    
}

export default angular.module('gateIn', [
    angularMeteor
]).component('gateIn', {
    templateUrl: 'imports/components/gateIn/gateIn.html',
    controller: ['$scope', GateIntCtrl]
});