import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './assetZone.html';

import { Warehouses } from '../../api/assets/warehouses.js';
import { Zones } from '../../api/assets/zones.js';

class AssetZoneCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('zones');
        this.subscribe('warehouses');

        this.helpers({
            zones(){
                return Zones.find({}, {sort:{id:-1}});
            },

            warehouses(){
                return Warehouses.find({});
            }
        });
    }

    addZone(newZone) {

        Session.set("newZone", newZone);

        /*
        * Execute getMaxId method, we need to do this complex logic because Mocha need fake id as input.
        */
        Meteor.call('zones.getMaxId', function(error, result){
            
            /*
            * Get item object which store in session
            */
            var zone = Session.get("newZone");

            zone.id = (parseInt(result) + 1) + '';
            zone.name = newZone.name;
            zone.warehouseId = newZone.warehouseId;
            zone.description = newZone.description;
            zone.maxCapacity = Number(newZone.maxCapacity);
            zone.remainCapacity = Number(newZone.maxCapacity); //initial amount always the same.
            zone.createdAt = new Date();

            /*
            * Execute insert method which will be a different scope again.
            */
            Meteor.call('zones.insert', zone);

        });     
    }     

    removeZone(id) {
        console.log("Remove zone id: " + id);
        Meteor.call('zones.remove', id);   
    }   
}   
 
export default angular.module('assetZone', [
    angularMeteor
]).component('assetZone', {
    templateUrl: 'imports/components/assetZone/assetZone.html',
    controller: ['$scope', AssetZoneCtrl]
});