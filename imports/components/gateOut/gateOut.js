import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './gateOut.html';


class GateOutCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.helpers({

            //อาทิตย์หน้าแก้จากตรงนี้นะให้นับจำนวน RFID ให้ได้้แล้วแล้วตัด maindocs เพื่อ update
            matchresult(){

                var maindocNum = {};

                var rfidNumbers = Rfidtmp.find({}).map(
                    function (item) { 
                        return item.rfid; 
                    }
                );
                
                /**
                 * Find match rfid from maindocs collection
                 */
                var rfidList = Rfidlist.find({rfid:{$in:rfidNumbers}}).map(
                    function (item) { 
                        /** มีปัญหาสำหรับ id ที่ซ้ำกันอยู่ */
                        return {rfid: item.rfid, maindocNo: item.maindocNo, status: item.status}; 
                    }
                );

                         /**
                 * Find invalid status of rfid from retreive collection
                 */
                var matchList = [];
                var rfidMatchList = [];
                var rfidInvalidList = [];
                for(r in rfidList){
                    
                    matchList.push(rfidList[r].rfid);
                    
                    if(rfidList[r].status === "I"){
                        rfidMatchList.push(rfidList[r]);
                        
                         /** Check duplicate record in scope objs */
                        if($scope.maindocsObj[rfidList[r].maindocNo]){
                         
                            if($scope.maindocsObj[rfidList[r].maindocNo]["count"][rfidList[r].rfid] === "I"){
                                $scope.maindocsObj[rfidList[r].maindocNo]["count"][rfidList[r].rfid] = "O";
                                $scope.maindocsObj[rfidList[r].maindocNo]["token"]++;
                            }else{
                                /**
                                 * ไม่รวมเคสที่ RFID ที่ทำการลงทะเบียนถูกต้องแต่มีรหัสซ้ำผ่านเข้า gate
                                 * เพราะฉนั้นระบบไม่สามารถดัก RFID ที่มี status R แต่มีรหัสซ้ำได้ ถ้าจะดักให้ดักที่ else ตรงนี้
                                 */
                            }

                            if($scope.maindocsObj[rfidList[r].maindocNo]["token"] == $scope.maindocsObj[rfidList[r].maindocNo]["max"]){
                                
                                Session.set("rfidCount", $scope.maindocsObj[rfidList[r].maindocNo]["count"]);

                                /** Update maindocs to be ready for in warehouse state */
                                Meteor.call('maindocs.updateStatus', rfidList[r].maindocNo, $scope.maindocsObj[rfidList[r].maindocNo]["count"], function(error, result){
                                    
                                    /** Update rfidlist to be ready for in warehouse state */
                                    Meteor.call('rfidlist.updateStatus', Session.get("rfidCount"), function(error, result){

                                        /** Update rfidlist to be ready for in warehouse state */
                                        Meteor.call('rfidtmp.remove', Session.get("rfidCount"), function(error, result){
                                            
                                            
                                        });
                                    });
                                    
                                });
                                
                                console.log("hae");
                            }

                        /** Insert new document record into scope obj */
                        }else{
                            var docObj = Maindocs.find({id:rfidList[r].maindocNo}).map(
                                function (item) { 
                                    return {max: Object.keys(item.rfid).length, count:item.rfid ,token: 0};
                            });

                            docObj[0]['count'][rfidList[r].rfid] = "O";
                            docObj[0]['token']++;

                            console.log(docObj);
                            $scope.maindocsObj[rfidList[r].maindocNo] = docObj[0];
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
            }

        });

        
    }
    
}

export default angular.module('gateOut', [
    angularMeteor
]).component('gateOut', {
    templateUrl: 'imports/components/gateOut/gateOut.html',
    controller: ['$scope', GateOutCtrl]
}); 