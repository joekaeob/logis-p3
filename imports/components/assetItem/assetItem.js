import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './assetItem.html';

import { Items } from '../../api/assets/items.js';

class AssetItemCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('items');

        this.helpers({
            items(){
                return Items.find({}, {sort:{id:-1}});
            }
        });
    }

    addItem(newItem) {

        Session.set("newItem", newItem);

        /*
        * Execute getMaxId method, we need to do this complex logic because Mocha need fake id as input.
        */
        Meteor.call('items.getMaxId', function(error, result){
            
            /*
            * Get item object which store in session
            */
            var item = Session.get("newItem");

            item.id = (parseInt(result) + 1) + '';
            item.name = newItem.name;
            item.number = newItem.number;
            item.price = Number(newItem.price);
            item.description = newItem.description;
            item.expire = new Date();
            item.createdAt = new Date();

            /*
            * Execute insert method which will be a different scope again.
            */
            Meteor.call('items.insert', item);

            $scope.newItem = {};
        });     
    }     

    removeItem(id) {
        console.log("Remove item id: " + id);
        Meteor.call('items.remove', id);   
    }   
}   
 
export default angular.module('assetItem', [
    angularMeteor
]).component('assetItem', {
    templateUrl: 'imports/components/assetItem/assetItem.html',
    controller: ['$scope', AssetItemCtrl]
});