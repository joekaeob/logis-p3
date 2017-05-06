import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './gateOut.html';

import { Maindocs } from '../../api/assets/maindocs.js';
import { Rfidlist } from '../../api/assets/rfidlist.js';
import { Rfidtmpout } from '../../api/assets/rfidtmpout.js';

class GateOutCtrl {

    constructor($scope, $http) {
        $scope.maindocsObj = {};
        $scope.ledStatus = {'danger':0, 'warning':0};
        $scope.viewModel(this);
        this.subscribe('maindocs');
        this.subscribe('rfidlist');
        this.subscribe('rfidtmpout');
        Meteor.call('rfidtmpout.removeAll');

        this.helpers({

            //อาทิตย์หน้าแก้จากตรงนี้นะให้นับจำนวน RFID ให้ได้้แล้วแล้วตัด maindocs เพื่อ update
            matchresult(){

                var maindocNum = {};

                /** ทุก map ทำให้ ิbig O เกิดปัญหาขึ้นเพราะต้องทำ double processes ในการดึงข้อมูลจาก array ใหญ่ */
                var rfidNumbersTmp = Rfidtmpout.find({}).map(
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

                /**
                 * Find invalid status of rfid from retreive collection
                 */
                var matchList = [];
                var rfidMatchList = [];
                var rfidInvalidList = [];
                for(r in rfidList){
                    
                    matchList.push(rfidList[r].rfid);
                    
                    if(rfidList[r].status === "I"){

                        //rfidMatchList.push(rfidList[r]);

                         /** Check existing record in scope objs, then update status */
                        if($scope.maindocsObj[rfidList[r].maindocNo]){
                            
                            if($scope.maindocsObj[rfidList[r].maindocNo]["token"] < $scope.maindocsObj[rfidList[r].maindocNo]["max"]){
                                if($scope.maindocsObj[rfidList[r].maindocNo]["count"][rfidList[r].rfid] === "I"){
                                    $scope.maindocsObj[rfidList[r].maindocNo]["count"][rfidList[r].rfid] = "O";
                                    console.log("this one " + rfidList[r].rfid + "become O");

                                    $scope.maindocsObj[rfidList[r].maindocNo]["token"]++;
                                }else{
                                    /**
                                     * ไม่รวมเคสที่ RFID ที่ทำการลงทะเบียนถูกต้องแต่มีรหัสซ้ำผ่านเข้า gate
                                     * เพราะฉนั้นระบบไม่สามารถดัก RFID ที่มี status R แต่มีรหัสซ้ำได้ ถ้าจะดักให้ดักที่ else ตรงนี้
                                     */
                                }
                            }

                        /** Insert new document record into scope obj */
                        }else{
                            
                            var docObj = Maindocs.find({id:rfidList[r].maindocNo, remark:"init"}, {sort: [ ["createAt", "desc"], ["id", "asc"] ] }).map(
                                function (item) { 
                                    return {_id:item._id, id:item.itemNo, max: item.orderAmount, count:item.rfid, status: item.remark, token: 0};
                            });

                            docObj[docObj.length-1]['count'][rfidList[r].rfid] = "O";
                            console.log("this one " + rfidList[r].rfid + "become O");
                            docObj[docObj.length-1]['token']++;

                            console.log(docObj);
                            $scope.maindocsObj[rfidList[r].maindocNo] = docObj[docObj.length-1];
                            
                        }

                        if($scope.maindocsObj[rfidList[r].maindocNo]["max"] === 0){
                            rfidInvalidList.push(rfidList[r]);
                        }else if($scope.maindocsObj[rfidList[r].maindocNo]["token"] > $scope.maindocsObj[rfidList[r].maindocNo]["max"]){    
                            rfidInvalidList.push(rfidList[r]);
                        }else if($scope.maindocsObj[rfidList[r].maindocNo]["status"] === "done"){    
                            rfidInvalidList.push(rfidList[r]);
                        }else{
                            rfidMatchList.push(rfidList[r]);
                        }

                        //rfidMatchList.push(rfidList[r]);
                        
                        if($scope.maindocsObj[rfidList[r].maindocNo]["token"] == $scope.maindocsObj[rfidList[r].maindocNo]["max"]){
                            
                            Session.set("rfidCount", $scope.maindocsObj[rfidList[r].maindocNo]["count"]);

                            /** Update maindocs to be ready for in warehouse state */
                            Meteor.call('maindocs.updateStatus', $scope.maindocsObj[rfidList[r].maindocNo]["_id"], $scope.maindocsObj[rfidList[r].maindocNo]["count"], function(error, result){
                                
                                $scope.maindocsObj[rfidList[r].maindocNo]["status"] = "done";

                                /** Update rfidlist to be ready for in warehouse state */
                                Meteor.call('rfidlist.updateStatusOut', Session.get("rfidCount"), function(error, result){

                                    /** Update rfidlist to be ready for in warehouse state */
                                    Meteor.call('rfidtmpout.remove', Session.get("rfidCount"), function(error, result){
                                        $http.get("http://localhost/logisflash/index.php?status=2")
                                        .then(function(response) {
                                            console.log(response);
                                        });

                                        $scope.ledStatus.warning = rfidNotMatchList.length;

                                        $http.get("http://localhost/logisflash/index.php?status=4")
                                        .then(function(response) {
                                            console.log(response);
                                        });

                                        $scope.ledStatus.danger = rfidInvalidList.length;
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
                var rfidNotMatchList = Rfidtmpout.find({rfid:{$nin:matchList}}).map(
                    function (item) {
                        return {rfid: item.rfid, createAt: item.createAt}; 
                    }
                );

                
                //Warning
                if($scope.ledStatus.warning < rfidNotMatchList.length){
                    $http.get("http://localhost/logisflash/index.php?status=1")
                    .then(function(response) {
                        console.log(response);
                    });

                    $scope.ledStatus.warning = rfidNotMatchList.length;
                }

                //Danger
                if($scope.ledStatus.danger < rfidInvalidList.length){
                    $http.get("http://localhost/logisflash/index.php?status=3")
                    .then(function(response) {
                        console.log(response);
                    });

                    $scope.ledStatus.danger = rfidInvalidList.length;
                }

                return {"success":rfidMatchList, "invalid":rfidInvalidList, "fail":rfidNotMatchList};     
            }

        });
        
    }

    removeRfidTmpAll() {
        console.log("Remove all rfidtmpout");
        Meteor.call('rfidtmpout.removeAll');  
    }   

    
    turnoffYellowLED(){
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://localhost/logisflash/index.php?status=2", true);
        xhttp.send();
    }

    turnoffRedLED(){
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://localhost/logisflash/index.php?status=4", true);
        xhttp.send();

    }
    
}

export default angular.module('gateOut', [
    angularMeteor
]).component('gateOut', {
    templateUrl: 'imports/components/gateOut/gateOut.html',
    controller: ['$scope','$http', GateOutCtrl]
}); 