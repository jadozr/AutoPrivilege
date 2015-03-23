#AutoPrivilege 

Car Dealers Site Web

------------

Add PlaceHolder to ngTable:

edit ng-table.js

after that in line 250 you can find
    <input type="text" ng-model="params.filter()[name]" ng-if="filter==\'text\'" ,class="input-filter form-control"/>

add placeholder there ie :
    <input type="text" ng-model="params.filter()[name]" ng-if="filter==\'text\'" placeholder="input {{name}}",class="input-filter form-control"/>

Stackoverflow: http://stackoverflow.com/questions/27174919/can-a-placeholder-be-set-on-the-input-in-an-ng-table
Example: http://plnkr.co/edit/q0CMCb7evmZh1sflVV5f?p=preview