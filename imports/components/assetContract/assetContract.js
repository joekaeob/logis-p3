import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import angularMeteor from 'angular-meteor';

import template from './assetContract.html';

import { Contracts } from '../../api/assets/contracts.js';

class AssetContractCtrl {
    constructor($scope) {
        $scope.viewModel(this);
        this.subscribe('contracts');

        this.helpers({
            contracts(){
                return Contracts.find({}, {sort:{id:-1}});
            }
        });
    }

    addContract(newContract) {

        Session.set("newContract", newContract);

        /*
        * Execute getMaxId method, we need to do this complex logic because Mocha need fake id as input.
        */
        Meteor.call('contracts.getMaxId', function(error, result){
            
            /*
            * Get item object which store in session
            */
            var contract = Session.get("newContract");

            contract.id = (parseInt(result) + 1) + '';
            contract.name = newContract.name,
            contract.description = newContract.description,
            contract.createdAt = new Date();

            /*
            * Execute insert method which will be a different scope again.
            */
            Meteor.call('contracts.insert', contract);

        });     
    }     

    removeContract(id) {
        console.log("Remove contract id: " + id);
        Meteor.call('contracts.remove', id);   
    }   
}   
 
export default angular.module('assetContract', [
    angularMeteor
]).component('assetContract', {
    templateUrl: 'imports/components/assetContract/assetContract.html',
    controller: ['$scope', AssetContractCtrl]
});