import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './assetVendor.html';

import { Vendors } from '../../api/assets/vendors.js';

class AssetVendorCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('vendors');

        this.helpers({
            vendors(){
                return Vendors.find({}, {sort:{id:-1}});
            }
        });
    }

    addVendor(newVendor) {

        Session.set("newVendor", newVendor);

        /*
        * Execute getMaxId method, we need to do this complex logic because Mocha need fake id as input.
        */
        Meteor.call('vendors.getMaxId', function(error, result){
            
            /*
            * Get item object which store in session
            */
            var vendor = Session.get("newVendor");

            vendor.id = (parseInt(result) + 1) + '';
            vendor.name = newVendor.name,
            vendor.description = newVendor.description,
            vendor.createdAt = new Date();

            /*
            * Execute insert method which will be a different scope again.
            */
            Meteor.call('vendors.insert', vendor);

        });     
    }     

    removeVendor(id) {
        console.log("Remove vendor id: " + id);
        Meteor.call('vendors.remove', id);   
    }   
}   
 
export default angular.module('assetVendor', [
    angularMeteor
]).component('assetVendor', {
    templateUrl: 'imports/components/assetVendor/assetVendor.html',
    controller: ['$scope', AssetVendorCtrl]
});