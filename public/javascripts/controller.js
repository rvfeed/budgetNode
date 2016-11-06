var app = angular.module('todoApp', ["ngRoute"]);
app.config(function($routeProvider){
        $routeProvider
       
        .when("/reports",
        {
            templateUrl: "./reports.html"            
        })
    });
    app.service("budgetService", function($http){
          var types = {types:[{"name":"raj"}]};
        this.getData = function(callback){
                return $http.get("kinds.json");
        }
            
                //return types;       
    });
    app.controller('insertDataController', function ($scope, $http, $timeout, budgetService) {
        var todoList = this;
        console.log("okkkk")
        budgetService.getData().then(function(data){
            $scope.kindsData = data.data.types; 
            $scope.kindsDataModel = $scope.kindsData[0].name;   
        })                
        $scope.kindsData = budgetService.types || "klkj";    
        $scope.updateData = "no";
        $scope.updateDataId = 0;
        $scope.subBtnText = "Submit";
        $scope.getResult = function(period){
            getBudgetData(period);
        }

        $scope.insertData = function () {
            
            if($scope.updateData == "yes"){
                update = false;
                $scope.budgetRow["update"] = "yes";
            }
            if(isNaN($scope.budgetRow.price)){
                $scope.msg = "Please enter number";
                return false;
            }
            var method = "POST";
            var id = "";
            if($scope.budgetRow._id){
                method = "PUT";
                id = "/"+$scope.budgetRow._id;
            }
            $scope.budgetRow["date"] = $("#itemDate").val();
            $scope.budgetRow["type"] = $scope.kindsDataModel;
            $scope.budgetRow["name"] = $scope.name;

            console.log("--------------------");
            $http({
                method  : method,
                url     : '/blobs'+id,
                data    : $.param($scope.budgetRow),  // pass in data as strings
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function(data) {
                    console.log(data);
                        console.log("okkkk");
                        $scope.budgetRow = {};
                        getBudgetData();
                        var flag;
                        if($scope.updateData){
                            flag = "Updated";
                        }else{
                            flag = "Added";
                        }
                        $scope.updateData = false;
                        $scope.subBtnText = "Submit";

                        // Temporary fix
                        $scope.budgetRow = {};
                        $scope.msg = flag+" succesfully";
                        timeOut(3000);
                        // if successful, bind success message to message
                        console.log("err");

                });
        }
        var timeOut = function(time){
            if(time === undefined){
                time= 3000;
            }
            var countUp = function() {
                $scope.msg ="";
                $scope.msgData = "";
            }
            $timeout(countUp, time);
        }
        var getTotal = function(result){
            var total = 0;
            for(var i = 0; i < result.length; i++){
                var item = result[i];
                total += (+item.price);
            }
            return total;
        }
        var getBudgetData = function (flag){
            var param = "";
            
            var update = false;

            if(flag != undefined){
                if(flag == "w" || flag == "m" || flag == "y" || flag == "t"){
                    param = "?p="+flag;
                }else{
                    param = "/"+flag;
                    update = true;
                }

            }else{
                param = "";
            }
            $http({
                method  : 'GET',
                url     : '/blobs'+param,
                data : param
            }).success(function(data) {
                console.log(flag);
                console.log(data);
                if(!update){
                    $scope.getTotal = getTotal(data);
                    $scope.resultData = data;
                }else{
                    console.log(data);
                     $scope.budgetRow = data
                     $scope.name = data.name;
                     $scope.kindsDataModel = data.type;
                }

            });
        }

        getBudgetData();

        $scope.deleteRow = function(id){
            if(!confirm("Are you sure?")){
                return false;
            }
            $http({
                method  : 'DELETE',
                url     : '/blobs/'+id,                
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function (data) {
                getBudgetData();
                $scope.msgData = "Deleted succesfully";
            }).error(function (err) {
                // if not successful, bind errors to error variables
                $scope.msg = "Error Occured";
            });
        }
        $scope.updateRow = function(id){
            $scope.updateData = "yes";
            $scope.updateDataId = id;
            $scope.subBtnText = "Update";
            getBudgetData(id);
        }

    });
    



