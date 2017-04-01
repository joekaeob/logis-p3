import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './orderComponent.html';

import { Maindocs } from '../../api/assets/maindocs.js';
import { Departments } from '../../api/assets/departments.js';

class OrderComponentCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('maindocs');
        this.subscribe('maindocsGroup');
        this.subscribe('departments');

        this.helpers({
            /** 
             *  ทีนี้ต้องแก้ตรงนี้ตอ่ละนะ ต้องกลับไปแก้ที่ regisComponent ด้วยเพราะว่า ตัว id ซ้ำมันแสดงอยู่ ต้องเอาออก 
             *  db.maindocs.aggregate([{"$sort": {"actionDate":-1}}]) อันนี้เป็น จุดสำคัญ
             *  หาวิธี group แล้ว sort เอา actionDate ล่าสุดของแต่ละ id ใน group maindoc ออกมาให้ได้เพราะว่ามันแสดงได้แค่ 1 record ต่อ 1 maindoc id
             *  ทีนี้ตอน gateout เราก็จะเลือกตัว latest date ของ maindoc นั้นออกมา แล้วทำการ countdown จำนวน RFID ที่ผ่านเกทออกไป
             */
            maindocs(){
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

    /**
     * เสร็จละตรงนี้
     */
    addMaindoc(orderNum, newMaindoc){
        var balance = newMaindoc.balanceAmount - orderNum;

        newMaindoc.receiveAmount = 0;
        newMaindoc.orderAmount = orderNum;
        newMaindoc.balanceAmount = balance;
        newMaindoc.remark = "init";
        newMaindoc.actionDate = new Date();

        delete newMaindoc["$$hashKey"];
        delete newMaindoc["_id"];
        
        console.log(newMaindoc);

        Meteor.call('maindocs.insert', newMaindoc, function(error, result){
            console.log("success");
        });
    }
    
}

export default angular.module('orderComponent', [
    angularMeteor
]).component('orderComponent', {
    templateUrl: 'imports/components/orderComponent/orderComponent.html',
    controller: ['$scope', OrderComponentCtrl]
}); 