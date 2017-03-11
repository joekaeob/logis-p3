import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './assetWarehouse.html';

import { Warehouses } from '../../api/assets/warehouses.js';

class AssetWarehouseCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('warehouses');

        this.helpers({
            warehouses(){
                return Warehouses.find({}, {sort:{id:-1}});
            }
        });
    }

     addWarehouse(newWarehouse) {

        Session.set("newWarehouse", newWarehouse);

        /*
        * Execute getMaxId method, we need to do this complex logic because Mocha need fake id as input.
        */
        Meteor.call('warehouses.getMaxId', function(error, result){
            
            /*
            * Get item object which store in session
            */
            var warehouse = Session.get("newWarehouse");

            warehouse.id = (parseInt(result) + 1) + '';
            warehouse.name = newWarehouse.name;
            warehouse.description = newWarehouse.description;
            //warehouse.zones = [];
            warehouse.createdAt = new Date();

            /*
            * Execute insert method which will be a different scope again.
            */
            Meteor.call('warehouses.insert', warehouse);

        });     
    }     

    removeWarehouse(id) {
        console.log("Remove warehouse id: " + id);
        Meteor.call('warehouses.remove', id);   
    }   

}   
 
export default angular.module('assetWarehouse', [
    angularMeteor
]).component('assetWarehouse', {
    templateUrl: 'imports/components/assetWarehouse/assetWarehouse.html',
    controller: ['$scope', AssetWarehouseCtrl]
});